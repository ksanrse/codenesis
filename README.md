# Codenesis

Платформа для изучения frontend-разработки через roadmaps и практические задачи.

## Структура

- `apps/platform` — Svelte 5 frontend.
- `apps/db` — HTTP API, passkey-авторизация и SQLite-состояние пользователя.
- `packages/challenges` — задания, тесты, решения и шкала прогресса.

Каталог задач хранится в PocketBase, когда задан `VITE_POCKETBASE_URL`. Для загрузки текущих задач в коллекцию PocketBase сначала соберите пакет и запустите синхронизацию:

```bash
POCKETBASE_URL=https://pb.example.com \
POCKETBASE_ADMIN_EMAIL=admin@example.com \
POCKETBASE_ADMIN_PASSWORD='...' \
pnpm pocketbase:sync
```

Коллекция `challenges` создаётся скриптом автоматически. Её `listRule` и `viewRule` открыты для чтения, а изменения выполняются только через PocketBase Dashboard или admin API. После добавления задачи в PocketBase фронтенд подхватит её без пересборки.

## Development

- Check everything is ready:

```bash
pnpm ready
```

- Run the tests:

```bash
vp run -r test
```

- Build the monorepo:

```bash
vp run -r build
```

- Run the development server:

```bash
pnpm dev
```
