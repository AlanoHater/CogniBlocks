
export enum BlockCategory {
  MOTION = 'MOTION',
  CONTROL = 'CONTROL',
  LOOKS = 'LOOKS',
}

export type BlockDefinition = {
  id: string; // Unique template ID
  label: string;
  category: BlockCategory;
  icon: string; // SVG path or emoji
  command: string; // Internal command name
  args?: number[]; // For simplicity, limited args
};

export type DraggableItem = {
  id: string; // Unique instance ID
  defId: string;
  label: string;
  category: BlockCategory;
  command: string;
};

export type GameState = {
  robotX: number;
  robotY: number;
  direction: 'N' | 'E' | 'S' | 'W';
  lights: boolean[]; // Status of lights on the grid
  levelComplete: boolean;
  logs: string[];
  isError: boolean;
  trail: Array<{x: number, y: number}>; // Coordinates visited
  lastAction: string | null; // To trigger specific animations
};

export type LevelConfig = {
  startPos: [number, number];
  startDir: 'N' | 'E' | 'S' | 'W';
  targetPos: [number, number];
  obstacles: [number, number][];
  gridSize: number;
};
