export function validateGrid({ rows, cols, cells, start, goal }) {
  if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1 || rows * cols > 10000) {
    throw new Error('Grid dimensions must be positive integers with at most 10,000 cells.');
  }
  if (!Array.isArray(cells) || cells.length !== rows * cols || Array.from(cells).some(cost => !Number.isInteger(cost) || cost < 0 || cost > 9)) {
    throw new Error('Each cell must have an integer cost from 0 (wall) to 9.');
  }
  for (const index of [start, goal]) {
    if (!Number.isInteger(index) || index < 0 || index >= cells.length || cells[index] === 0) {
      throw new Error('Start and goal must be walkable grid positions.');
    }
  }
}

export function neighbors(index, rows, cols) {
  const row = Math.floor(index / cols), col = index % cols;
  return [row > 0 ? index - cols : -1, col < cols - 1 ? index + 1 : -1,
    row < rows - 1 ? index + cols : -1, col > 0 ? index - 1 : -1].filter(value => value >= 0);
}

// Dijkstra uses a linear frontier: deliberately simple for small teaching grids.
// Terrain cost is paid when entering a cell. The starting cell costs nothing.
export function search(grid, algorithm = 'dijkstra') {
  validateGrid(grid);
  if (!['bfs', 'dijkstra'].includes(algorithm)) throw new Error('Choose bfs or dijkstra.');
  const { rows, cols, cells, start, goal } = grid;
  const distances = Array(cells.length).fill(Infinity);
  const previous = Array(cells.length).fill(-1);
  const visited = [], finalized = new Set(), frontier = [start];
  distances[start] = 0;
  let queueHead = 0;
  while (algorithm === 'bfs' ? queueHead < frontier.length : frontier.length > 0) {
    let position = 0;
    if (algorithm === 'dijkstra') {
      for (let i = 1; i < frontier.length; i++) {
        if (distances[frontier[i]] < distances[frontier[position]]) position = i;
      }
    }
    const current = algorithm === 'bfs' ? frontier[queueHead++] : frontier.splice(position, 1)[0];
    if (finalized.has(current)) continue;
    finalized.add(current);
    visited.push(current);
    if (current === goal) break;
    for (const next of neighbors(current, rows, cols)) {
      if (!cells[next] || finalized.has(next)) continue;
      const nextDistance = distances[current] + (algorithm === 'bfs' ? 1 : cells[next]);
      if (nextDistance < distances[next]) {
        const undiscovered = distances[next] === Infinity;
        distances[next] = nextDistance;
        previous[next] = current;
        if (undiscovered) frontier.push(next);
      }
    }
  }
  if (!finalized.has(goal)) return { found: false, path: [], visited, steps: null, cost: null };
  const path = [];
  for (let index = goal; index !== -1; index = previous[index]) path.push(index);
  path.reverse();
  return { found: true, path, visited, steps: path.length - 1,
    cost: path.slice(1).reduce((total, index) => total + cells[index], 0) };
}
