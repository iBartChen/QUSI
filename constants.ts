export const SFX_TEXTS = [
  "ゴゴゴ", // Gogogo (Rumble)
  "ドカッ", // Doka (Thud/Punch)
  "パシッ", // Pashi (Slap)
  "ズキューン", // Zukyun (Bang/Heartbeat)
  "ドン！", // Don! (Boom)
  "ボゴォ", // Bogoo (Heavy hit)
  "ORA!", // Ora!
  "MUDDA!", // Muda!
  "SHINE!", // Die!
];

export const COLORS = [
  "#ef4444", // red-500
  "#3b82f6", // blue-500
  "#a855f7", // purple-500
  "#000000", // black
  "#ffffff", // white
];

export const MAX_CANVAS_WIDTH = 800;
export const MAX_CANVAS_HEIGHT = 800;

export interface EffectItem {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  rotation: number;
  scale: number;
}