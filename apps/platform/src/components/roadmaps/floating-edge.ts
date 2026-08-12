import { Position, type InternalNode, type XYPosition } from "@xyflow/svelte";

function nodeCenter(node: InternalNode): XYPosition {
  return {
    x: node.internals.positionAbsolute.x + (node.measured.width ?? 0) / 2,
    y: node.internals.positionAbsolute.y + (node.measured.height ?? 0) / 2,
  };
}

function nodeIntersection(node: InternalNode, other: InternalNode): XYPosition {
  const width = Math.max(node.measured.width ?? 0, 1);
  const height = Math.max(node.measured.height ?? 0, 1);
  const center = nodeCenter(node);
  const target = nodeCenter(other);
  const dx = target.x - center.x;
  const dy = target.y - center.y;
  const isSkill = (node.data as { kind?: string } | undefined)?.kind === "skill";

  // Skill nodes are circles inside a square Flow bounding box. Intersecting
  // with the box sends diagonal edges through its invisible corners; use the
  // actual circle boundary instead so every edge meets the visible ring.
  if (isSkill) {
    const distance = Math.hypot(dx, dy) || 1;
    const radius = Math.min(width, height) / 2 - 1;
    return {
      x: center.x + (dx / distance) * radius,
      y: center.y + (dy / distance) * radius,
    };
  }

  const scale = 1 / Math.max(Math.abs(dx) / (width / 2), Math.abs(dy) / (height / 2), 1);

  return { x: center.x + dx * scale, y: center.y + dy * scale };
}

function edgePosition(node: InternalNode, point: XYPosition, other: InternalNode): Position {
  const { x, y } = node.internals.positionAbsolute;
  const width = node.measured.width ?? 0;
  const height = node.measured.height ?? 0;
  const isSkill = (node.data as { kind?: string } | undefined)?.kind === "skill";

  if (isSkill) {
    const center = nodeCenter(node);
    const dx = nodeCenter(other).x - center.x;
    const dy = nodeCenter(other).y - center.y;
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? Position.Right : Position.Left;
    return dy > 0 ? Position.Bottom : Position.Top;
  }

  const distances = [
    { distance: Math.abs(point.x - x), position: Position.Left },
    { distance: Math.abs(point.x - (x + width)), position: Position.Right },
    { distance: Math.abs(point.y - y), position: Position.Top },
    { distance: Math.abs(point.y - (y + height)), position: Position.Bottom },
  ];

  return distances.sort((left, right) => left.distance - right.distance)[0].position;
}

export function getFloatingEdgeParams(source: InternalNode, target: InternalNode) {
  const sourcePoint = nodeIntersection(source, target);
  const targetPoint = nodeIntersection(target, source);
  return {
    sourceX: sourcePoint.x,
    sourceY: sourcePoint.y,
    sourcePosition: edgePosition(source, sourcePoint, target),
    targetX: targetPoint.x,
    targetY: targetPoint.y,
    targetPosition: edgePosition(target, targetPoint, source),
  };
}
