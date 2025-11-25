import type { GardenSlot } from '../types/game';

export const WATER_DECAY_RATE = 0.5;
export const SEED_DECAY_RATE = 0.4;
export const CRITICAL_THRESHOLD = 30;
export const WITHER_THRESHOLD = 0;

export function updatePlantMeters(slot: GardenSlot, deltaTime: number): GardenSlot {
  if (!slot.occupied) return slot;

  const waterDecay = WATER_DECAY_RATE * (deltaTime / 1000);
  const seedDecay = SEED_DECAY_RATE * (deltaTime / 1000);

  const newWaterMeter = Math.max(0, slot.waterMeter - waterDecay);
  const newSeedMeter = Math.max(0, slot.seedMeter - seedDecay);

  if (newWaterMeter === 0 || newSeedMeter === 0) {
    return {
      ...slot,
      occupied: false,
      plantType: undefined,
      plantRank: undefined,
      waterMeter: 100,
      seedMeter: 100,
      lastWatered: undefined,
      lastFed: undefined,
    };
  }

  return {
    ...slot,
    waterMeter: newWaterMeter,
    seedMeter: newSeedMeter,
  };
}

export function needsWater(slot: GardenSlot): boolean {
  return slot.occupied && slot.waterMeter < CRITICAL_THRESHOLD;
}

export function needsSeeds(slot: GardenSlot): boolean {
  return slot.occupied && slot.seedMeter < CRITICAL_THRESHOLD;
}

export function waterPlant(slot: GardenSlot, amount: number = 100): GardenSlot {
  if (!slot.occupied) return slot;

  return {
    ...slot,
    waterMeter: Math.min(100, slot.waterMeter + amount),
    lastWatered: Date.now(),
  };
}

export function feedPlant(slot: GardenSlot, amount: number = 100): GardenSlot {
  if (!slot.occupied) return slot;

  return {
    ...slot,
    seedMeter: Math.min(100, slot.seedMeter + amount),
    lastFed: Date.now(),
  };
}
