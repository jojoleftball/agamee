import type { BoardItem, MergeResult } from '../types/game';

export function canMerge(items: BoardItem[]): boolean {
  if (items.length < 3) return false;
  
  const firstItem = items[0];
  return items.every(
    (item) =>
      item.itemType === firstItem.itemType &&
      item.rank === firstItem.rank &&
      item.category === firstItem.category
  );
}

export function findMergeableGroups(
  boardItems: BoardItem[],
  gridCols: number,
  gridRows: number
): BoardItem[][] {
  const groups: BoardItem[][] = [];
  const processed = new Set<string>();

  for (const item of boardItems) {
    if (processed.has(item.id)) continue;

    const nearby = findNearbyItems(item, boardItems, gridCols, gridRows);
    if (nearby.length >= 3) {
      const group = nearby.slice(0, 3);
      if (canMerge(group)) {
        groups.push(group);
        group.forEach((i) => processed.add(i.id));
      }
    }
  }

  return groups;
}

export function findNearbyItems(
  centerItem: BoardItem,
  allItems: BoardItem[],
  gridCols: number,
  gridRows: number
): BoardItem[] {
  return allItems.filter((item) => {
    if (item.id === centerItem.id) return true;
    if (item.itemType !== centerItem.itemType) return false;
    if (item.rank !== centerItem.rank) return false;
    if (item.category !== centerItem.category) return false;

    const dx = Math.abs(item.x - centerItem.x);
    const dy = Math.abs(item.y - centerItem.y);

    return dx <= 1 && dy <= 1;
  });
}

export function performMerge(
  items: BoardItem[],
  targetX: number,
  targetY: number
): MergeResult {
  if (!canMerge(items) || items.length < 3) {
    return { success: false };
  }

  const firstItem = items[0];
  const newRank = firstItem.rank + 1;

  if (firstItem.maxRank && newRank > firstItem.maxRank) {
    return { success: false };
  }

  const newItem: BoardItem = {
    id: `merged-${Date.now()}-${Math.random()}`,
    category: firstItem.category,
    itemType: firstItem.itemType,
    rank: newRank,
    maxRank: firstItem.maxRank,
    x: targetX,
    y: targetY,
  };

  return {
    success: true,
    newItem,
    consumedItems: items.slice(0, 3),
    position: { x: targetX, y: targetY },
  };
}

export function isValidPosition(
  x: number,
  y: number,
  gridCols: number,
  gridRows: number,
  boardItems: BoardItem[],
  excludeId?: string
): boolean {
  if (x < 0 || x >= gridCols || y < 0 || y >= gridRows) {
    return false;
  }

  const occupied = boardItems.some(
    (item) => item.x === x && item.y === y && item.id !== excludeId
  );

  return !occupied;
}
