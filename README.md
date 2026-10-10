# Pathfinder Lab

A small, interactive JavaScript grid that makes the difference between **fewest steps** and **lowest cost** visible. Paint walls and expensive terrain, move the start and goal, then compare breadth-first search with Dijkstra's algorithm.

![Pathfinder Lab weighted-grid example](docs/preview.png)

## Run locally

No install or API key is needed. Serve this folder with Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. A local server is required because the page uses JavaScript modules.

1. Click **Load example** to create a map with expensive terrain.
2. Run **BFS** and note the number of steps and terrain cost.
3. Run **Dijkstra** on the same map. Its route can be longer but cheaper.
4. Choose a paint tool and click cells to explore your own map.

## What it demonstrates

- Breadth-first search minimizes moves when every move is treated equally.
- Dijkstra minimizes the sum of the costs of entered cells.
- A wall has cost 0, ordinary terrain costs 1, and painted terrain costs 5.
- Moves are orthogonal; diagonal moves are excluded. The start cell has no entry cost.
- Exploration and route animations respect reduced-motion settings.
- Controls and cells work with a keyboard; small screens can scroll the map horizontally.

The search module is independent of the interface and accepts grids up to 10,000 cells. Dijkstra uses a straightforward linear frontier rather than a priority queue: this keeps the teaching implementation readable, but it is not designed for large maps. Its worst-case running time is O(V²); BFS runs in O(V + E). Both algorithms use O(V) space. The interactive map has 240 cells.

## Tests

With Node.js 22 or newer:

```sh
npm test
```

Tests cover walls, boundaries, unreachable goals, weighted detours, adjacency, unchanged input, start equal to goal, and invalid grids. GitHub Actions runs them on Node 22 and 24 after publication.

## Project map

```text
index.html           Interface and explanations
src/search.js        Validated BFS and Dijkstra search
src/app.js           Map editing and results
src/style.css        Responsive layout and motion
test/search.test.js  Algorithm checks
```

The map is held only in memory. Refreshing resets it; there is no cloud storage or account system.

## License

MIT © 2026 Kenneth Park.
