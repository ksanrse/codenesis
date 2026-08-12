const API_BASE = (import.meta.env.VITE_CODENESIS_API_URL as string | undefined) ?? "/api";
const LOCAL_DEV_SESSION_KEY = "codenesis:local-dev-session";
export type RecoveryFile = { type: "codenesis-recovery"; version: 1; recoveryPhrase: string };
export type AuthUser = {
  id: string;
  name: string;
  role: "owner" | "developer";
};
export type AuthSession = {
  authenticated: boolean;
  user?: AuthUser;
};
function b64(v: string): ArrayBuffer {
  const s = v
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(v.length / 4) * 4, "=");
  const raw = atob(s);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0)).buffer;
}
function out(v: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(v)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
async function request<T>(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  const r = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || `Auth request failed (${r.status})`);
  return body as T;
}
export async function getAuthSession(): Promise<AuthSession> {
  if (import.meta.env.DEV && sessionStorage.getItem(LOCAL_DEV_SESSION_KEY) === "1") {
    return {
      authenticated: true,
      user: { id: "codenesis-developer", name: "Developer", role: "developer" },
    };
  }
  return request<AuthSession>("/auth/session");
}
export async function logout(): Promise<void> {
  if (import.meta.env.DEV && sessionStorage.getItem(LOCAL_DEV_SESSION_KEY) === "1") {
    sessionStorage.removeItem(LOCAL_DEV_SESSION_KEY);
    window.dispatchEvent(new Event("codenesis-auth-change"));
    return;
  }
  await request("/auth/logout", { method: "POST", body: "{}" });
}
export async function loginDeveloper(code = ""): Promise<AuthSession> {
  if (import.meta.env.DEV && !code) {
    sessionStorage.setItem(LOCAL_DEV_SESSION_KEY, "1");
    const user = { id: "codenesis-developer", name: "Developer", role: "developer" as const };
    window.dispatchEvent(new Event("codenesis-auth-change"));
    return { authenticated: true, user };
  }
  const result = await request<{ ok: true; user: AuthUser }>("/dev/login", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  window.dispatchEvent(new Event("codenesis-auth-change"));
  return { authenticated: true, user: result.user };
}

export async function setDeveloperProgress(
  challenges: Array<{ id: string; title: string; language: string; solved: boolean }>,
  skillProgress: Record<string, number>,
): Promise<{ skillProgress: Record<string, number> }> {
  if (import.meta.env.DEV && sessionStorage.getItem(LOCAL_DEV_SESSION_KEY) === "1") {
    const result = { skillProgress };
    localStorage.setItem(
      "codenesis:local-dev-progress",
      JSON.stringify({ challenges, skillProgress }),
    );
    window.dispatchEvent(new CustomEvent("codenesis-dev-progress-change", { detail: result }));
    return result;
  }
  const result = await request<{ skillProgress: Record<string, number> }>("/dev/progress", {
    method: "PUT",
    body: JSON.stringify({ challenges, skillProgress }),
  });
  window.dispatchEvent(new CustomEvent("codenesis-dev-progress-change", { detail: result }));
  window.dispatchEvent(new Event("codenesis-auth-change"));
  return result;
}

export async function getDeveloperProgress(): Promise<{ skillProgress: Record<string, number> }> {
  if (import.meta.env.DEV && sessionStorage.getItem(LOCAL_DEV_SESSION_KEY) === "1") {
    try {
      const stored = JSON.parse(localStorage.getItem("codenesis:local-dev-progress") ?? "null") as {
        skillProgress?: Record<string, number>;
      } | null;
      return { skillProgress: stored?.skillProgress ?? {} };
    } catch {
      return { skillProgress: {} };
    }
  }
  return request("/dev/progress");
}
function creation(o: PublicKeyCredentialCreationOptions): PublicKeyCredentialCreationOptions {
  return {
    ...o,
    challenge: b64(o.challenge as unknown as string),
    user: { ...o.user, id: b64(o.user.id as unknown as string) },
    excludeCredentials: o.excludeCredentials?.map((x) => ({
      ...x,
      id: b64(x.id as unknown as string),
    })),
  };
}
function assertion(o: PublicKeyCredentialRequestOptions): PublicKeyCredentialRequestOptions {
  return {
    ...o,
    challenge: b64(o.challenge as unknown as string),
    allowCredentials: o.allowCredentials?.map((x) => ({
      ...x,
      id: b64(x.id as unknown as string),
    })),
  };
}
function serialize(c: PublicKeyCredential): Record<string, unknown> {
  const r = c.response as AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
  const response: Record<string, unknown> = { clientDataJSON: out(r.clientDataJSON) };
  if ("attestationObject" in r) response.attestationObject = out(r.attestationObject);
  if ("authenticatorData" in r) response.authenticatorData = out(r.authenticatorData);
  if ("signature" in r) response.signature = out(r.signature);
  if ("userHandle" in r && r.userHandle) response.userHandle = out(r.userHandle);
  return { id: c.id, rawId: out(c.rawId), type: c.type, response };
}
export async function registerPasskey(): Promise<{ recoveryFile: RecoveryFile }> {
  if (!window.PublicKeyCredential) throw new Error("Этот браузер не поддерживает passkey.");
  const o = await request<PublicKeyCredentialCreationOptions>("/auth/passkey/register/options", {
    method: "POST",
    body: "{}",
  });
  const c = (await navigator.credentials.create({
    publicKey: creation(o),
  })) as PublicKeyCredential | null;
  if (!c) throw new Error("Регистрация отменена.");
  const result = await request<{ recoveryFile: RecoveryFile }>("/auth/passkey/register/verify", {
    method: "POST",
    body: JSON.stringify(serialize(c)),
  });
  window.dispatchEvent(new Event("codenesis-auth-change"));
  return result;
}
export async function loginPasskey(): Promise<void> {
  if (!window.PublicKeyCredential) throw new Error("Этот браузер не поддерживает passkey.");
  const o = await request<PublicKeyCredentialRequestOptions>("/auth/passkey/login/options", {
    method: "POST",
    body: "{}",
  });
  const c = (await navigator.credentials.get({
    publicKey: assertion(o),
  })) as PublicKeyCredential | null;
  if (!c) throw new Error("Вход отменен.");
  await request("/auth/passkey/login/verify", {
    method: "POST",
    body: JSON.stringify(serialize(c)),
  });
  window.dispatchEvent(new Event("codenesis-auth-change"));
}
export async function restoreWithRecovery(file: RecoveryFile): Promise<void> {
  const result = await request<{ ok: boolean }>("/auth/recovery/restore", {
    method: "POST",
    body: JSON.stringify({ recoveryFile: file }),
  });
  if (!result.ok) throw new Error("Неверный recovery-файл.");
  window.dispatchEvent(new Event("codenesis-auth-change"));
}
export async function updatePasskeyWithRecovery(file: RecoveryFile): Promise<void> {
  await restoreWithRecovery(file);
  const o = await request<PublicKeyCredentialCreationOptions>(
    "/auth/recovery/update-passkey/options",
    { method: "POST", body: JSON.stringify({ recoveryFile: file }) },
  );
  const c = (await navigator.credentials.create({
    publicKey: creation(o),
  })) as PublicKeyCredential | null;
  if (!c) throw new Error("Обновление passkey отменено.");
  await request("/auth/recovery/update-passkey", {
    method: "POST",
    body: JSON.stringify(serialize(c)),
  });
}
export function downloadRecoveryFile(file: RecoveryFile): void {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(file, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "codenesis-recovery.json";
  a.click();
  URL.revokeObjectURL(url);
}
export async function readRecoveryFile(file: File): Promise<RecoveryFile> {
  const p = JSON.parse(await file.text()) as Partial<RecoveryFile>;
  if (
    p.type !== "codenesis-recovery" ||
    p.version !== 1 ||
    !p.recoveryPhrase ||
    p.recoveryPhrase.trim().split(/\s+/).length !== 12
  )
    throw new Error("Неверный recovery-файл: ожидалось ровно 12 слов.");
  return {
    type: "codenesis-recovery",
    version: 1,
    recoveryPhrase: p.recoveryPhrase.trim().toLowerCase(),
  };
}
