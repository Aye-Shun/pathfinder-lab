import test from 'node:test';
import assert from 'node:assert/strict';
import { neighbors, search } from '../src/search.js';
const make = (rows, cols, cells, start = 0, goal = cells.length - 1) => ({ rows, cols, cells, start, goal });
test('neighbors never wrap rows', () => {
  assert.deepEqual(neighbors(2, 2, 3), [5, 1]);
  assert.deepEqual(neighbors(0, 2, 3), [1, 3]);
});
test('both searches find a shortest path on uniform terrain', () => {
  for (const algorithm of ['bfs', 'dijkstra']) {
    const result = search(make(3, 3, Array(9).fill(1)), algorithm);
    assert.equal(result.steps, 4); assert.equal(result.cost, 4);
    assert.equal(result.path[0], 0); assert.equal(result.path.at(-1), 8);
  }
});
test('Dijkstra takes a longer route when it is cheaper', () => {
  const grid = make(2, 4, [1, 9, 9, 1, 1, 1, 1, 1], 0, 3);
  const bfs = search(grid, 'bfs'), dijkstra = search(grid);
  assert.equal(bfs.steps, 3); assert.equal(bfs.cost, 19);
  assert.equal(dijkstra.steps, 5); assert.equal(dijkstra.cost, 5);
});
test('walls block routes and do not enter the exploration', () => {
  const result = search(make(2, 3, [1, 0, 1, 1, 0, 1]));
  assert.equal(result.found, false); assert.deepEqual(result.path, []);
  assert.deepEqual(result.visited, [0, 3]); assert.equal(result.cost, null);
});
test('start equal to goal needs no move or cost', () => {
  assert.deepEqual(search(make(1, 1, [9])), { found:true, path:[0], visited:[0], steps:0, cost:0 });
});
test('weighted search selects the cheapest available approach', () => {
  const grid = make(3, 3, [1, 8, 1, 1, 1, 1, 1, 9, 1], 0, 2);
  assert.equal(search(grid).cost, 4);
});
test('path consists of adjacent walkable cells; inputs remain unchanged', () => {
  const grid = make(3, 4, [1,0,1,1,1,0,1,1,1,1,1,1]);
  const snapshot = structuredClone(grid), result = search(grid);
  for (let i = 1; i < result.path.length; i++) {
    assert.ok(neighbors(result.path[i - 1], grid.rows, grid.cols).includes(result.path[i]));
    assert.ok(grid.cells[result.path[i]] > 0);
  }
  assert.deepEqual(grid, snapshot);
});
test('rejects malformed grids and algorithms', () => {
  for (const grid of [make(0, 2, []), make(1, 2, [1]), make(1, 2, [1,-1]), make(1, 2,[1,0]), make(1,2,[1,1],-1), make(1,2,Array(2))]) assert.throws(() => search(grid));
  assert.throws(() => search(make(1,1,[1]),'astar'));
});
