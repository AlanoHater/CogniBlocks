
import { GameState, LevelConfig, DraggableItem } from "../types";

export const INITIAL_LEVEL: LevelConfig = {
  gridSize: 5,
  startPos: [0, 4], // Bottom left
  startDir: 'E',
  targetPos: [4, 0], // Top right
  obstacles: [[1, 3], [1, 4], [3, 1], [3, 2]]
};

export const getInitialState = (level: LevelConfig): GameState => ({
  robotX: level.startPos[0],
  robotY: level.startPos[1],
  direction: level.startDir,
  lights: [],
  levelComplete: false,
  logs: ["Robot listo. Esperando instrucciones..."],
  isError: false,
  trail: [],
  lastAction: null
});

const DIRECTIONS = ['N', 'E', 'S', 'W'];
const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0]; // Y grows downwards usually in grids

// --- MAZE GENERATION LOGIC ---

// Check if a path exists using BFS
const isSolvable = (size: number, start: [number, number], target: [number, number], obstacles: [number, number][]): boolean => {
  const queue = [start];
  const visited = new Set<string>();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!;
    if (cx === target[0] && cy === target[1]) return true;

    for (let i = 0; i < 4; i++) {
      const nx = cx + DX[i];
      const ny = cy + DY[i];

      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        const isObs = obstacles.some(obs => obs[0] === nx && obs[1] === ny);
        const key = `${nx},${ny}`;
        if (!isObs && !visited.has(key)) {
          visited.add(key);
          queue.push([nx, ny]);
        }
      }
    }
  }
  return false;
};

export const generateRandomLevel = (): LevelConfig => {
  const gridSize = 5;
  const startPos: [number, number] = [0, gridSize - 1];
  const targetPos: [number, number] = [gridSize - 1, 0];
  
  let obstacles: [number, number][] = [];
  let solvable = false;
  let attempts = 0;

  while (!solvable && attempts < 100) {
    obstacles = [];
    const numObstacles = Math.floor(Math.random() * 5) + 3; // 3 to 7 obstacles

    while (obstacles.length < numObstacles) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      
      const isStart = x === startPos[0] && y === startPos[1];
      const isTarget = x === targetPos[0] && y === targetPos[1];
      const exists = obstacles.some(o => o[0] === x && o[1] === y);

      if (!isStart && !isTarget && !exists) {
        obstacles.push([x, y]);
      }
    }

    if (isSolvable(gridSize, startPos, targetPos, obstacles)) {
      solvable = true;
    }
    attempts++;
  }

  // Fallback if random gen fails (rare in 5x5)
  if (!solvable) return INITIAL_LEVEL;

  return {
    gridSize,
    startPos,
    startDir: 'E',
    targetPos,
    obstacles
  };
};

// --- SIMULATION LOGIC ---

export const runSimulation = async (
  blocks: DraggableItem[],
  level: LevelConfig,
  updateState: (state: GameState) => void,
  onAction: (type: 'move' | 'turn' | 'jump' | 'crash' | 'win') => void,
  delay: number = 500
) => {
  let currentState = getInitialState(level);
  currentState.logs = ["Ejecutando programa..."];
  updateState({ ...currentState });

  for (const block of blocks) {
    await new Promise(r => setTimeout(r, delay));

    let { robotX, robotY, direction, logs, trail } = currentState;
    const dirIdx = DIRECTIONS.indexOf(direction);

    // Tentative new state
    let nextX = robotX;
    let nextY = robotY;
    let nextDir = direction;
    let logMsg = "";
    let actionType: 'move' | 'turn' | 'jump' | null = null;

    // Save current pos to trail before moving
    const currentPos = { x: robotX, y: robotY };
    let newTrail = [...trail];

    switch (block.command) {
      case 'move_forward':
        nextX += DX[dirIdx];
        nextY += DY[dirIdx];
        logMsg = "Avanzar";
        actionType = 'move';
        // Only add to trail if we actually move
        newTrail.push(currentPos);
        break;
      case 'turn_left':
        nextDir = DIRECTIONS[(dirIdx + 3) % 4] as any;
        logMsg = "Giro Izquierda";
        actionType = 'turn';
        break;
      case 'turn_right':
        nextDir = DIRECTIONS[(dirIdx + 1) % 4] as any;
        logMsg = "Giro Derecha";
        actionType = 'turn';
        break;
      case 'jump':
        nextX += DX[dirIdx] * 2;
        nextY += DY[dirIdx] * 2;
        logMsg = "Salto Doble";
        actionType = 'jump';
        // Add both intermediate and current to trail for jump visual continuity
        newTrail.push(currentPos);
        newTrail.push({ x: robotX + DX[dirIdx], y: robotY + DY[dirIdx] });
        break;
    }

    // Boundary & Obstacle Check
    const isOutOfBounds = nextX < 0 || nextX >= level.gridSize || nextY < 0 || nextY >= level.gridSize;
    const isObstacle = level.obstacles.some(obs => obs[0] === nextX && obs[1] === nextY);

    if (isOutOfBounds || isObstacle) {
      onAction('crash');
      updateState({
        ...currentState,
        isError: true,
        lastAction: 'crash',
        logs: [...logs, `💥 Choque en posición calculada (${nextX}, ${nextY})`]
      });
      return; // Stop execution
    }

    // Play action sound if successful
    if (actionType) onAction(actionType);

    currentState = {
      ...currentState,
      robotX: nextX,
      robotY: nextY,
      direction: nextDir,
      trail: newTrail,
      lastAction: actionType,
      logs: [...logs, logMsg]
    };

    // Check Win
    if (nextX === level.targetPos[0] && nextY === level.targetPos[1]) {
      currentState.levelComplete = true;
      currentState.logs.push("🎉 META ALCANZADA! Buen trabajo!");
    }

    updateState({ ...currentState });

    if (currentState.levelComplete) {
      onAction('win');
      break;
    }
  }

  if (!currentState.levelComplete && !currentState.isError) {
      updateState({
          ...currentState,
          lastAction: null,
          logs: [...currentState.logs, "Fin del programa. Meta no alcanzada."]
      })
  }
};
