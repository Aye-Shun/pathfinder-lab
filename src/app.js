import { search } from './search.js';

const rows = 12, cols = 20;
let cells = Array(rows * cols).fill(1), start = 101, goal = 118, mode = 'wall', result = null;
const grid = document.querySelector('#grid'), status = document.querySelector('#status');
function draw() {
  const focusedIndex = document.activeElement?.dataset?.index;
  const visited = new Map((result?.visited ?? []).map((value, order) => [value, order]));
  const path = new Map((result?.path ?? []).map((value, order) => [value, order]));
  grid.replaceChildren(...cells.map((cost, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.index = String(index);
    button.className = `cell ${cost === 0 ? 'wall' : cost > 1 ? 'terrain' : ''} ${visited.has(index) ? 'visited' : ''} ${path.has(index) ? 'path' : ''}`;
    if (index === start) button.classList.add('start');
    if (index === goal) button.classList.add('goal');
    button.textContent = index === start ? 'S' : index === goal ? 'G' : cost > 1 ? cost : '';
    button.setAttribute('aria-label', `Row ${Math.floor(index / cols) + 1}, column ${index % cols + 1}: ${index === start ? 'start' : index === goal ? 'goal' : cost === 0 ? 'wall' : `cost ${cost}`}`);
    const delay = path.has(index) ? (result.visited.length * 4 + path.get(index) * 25) : (visited.get(index) ?? 0) * 4;
    button.style.setProperty('--delay', `${delay}ms`);
    button.addEventListener('click', () => edit(index));
    return button;
  }));
  if (focusedIndex !== undefined) grid.children[Number(focusedIndex)]?.focus({ preventScroll: true });
}
function edit(index) {
  if (mode === 'start') { if (index !== goal) { start = index; cells[index] = 1; } }
  else if (mode === 'goal') { if (index !== start) { goal = index; cells[index] = 1; } }
  else if (index !== start && index !== goal) {
    cells[index] = mode === 'wall' ? (cells[index] === 0 ? 1 : 0) : mode === 'terrain' ? (cells[index] === 5 ? 1 : 5) : 1;
  }
  result = null;
  status.textContent = 'Grid changed. Run a search to compare routes.';
  draw();
}
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
  mode = button.dataset.mode;
  document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));
document.querySelector('#run').addEventListener('click', () => {
  result = search({ rows, cols, cells, start, goal }, document.querySelector('#algorithm').value);
  status.textContent = result.found ? `${result.steps} steps · terrain cost ${result.cost} · ${result.visited.length} cells explored` : `No route found · ${result.visited.length} cells explored`;
  draw();
});
document.querySelector('#reset').addEventListener('click', () => {
  cells = Array(rows * cols).fill(1); start = 101; goal = 118; result = null;
  status.textContent = 'Clean grid. Click cells to build a new map.'; draw();
});
document.querySelector('#example').addEventListener('click', () => {
  cells = Array(rows * cols).fill(1); start = 101; goal = 118;
  for (let col = 3; col < 17; col++) cells[5 * cols + col] = 5;
  for (let row = 1; row < 10; row++) if (row !== 5 && row !== 8) cells[row * cols + 10] = 0;
  result = null; status.textContent = 'Weighted example loaded. Compare BFS with Dijkstra.'; draw();
});
draw();
