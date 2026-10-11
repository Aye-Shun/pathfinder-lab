# Pathfinder Lab

A grid for trying BFS and Dijkstra's algorithm. Paint walls or expensive terrain and compare the routes.

![Pathfinder Lab](docs/preview.png)

## Open it

From this folder, with Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Go to <http://127.0.0.1:8000>. Opening `index.html` directly won't load the JavaScript modules.

Click **Load example**, run BFS, then Dijkstra. BFS minimizes moves; Dijkstra minimizes terrain cost. Normal cells cost 1 and painted terrain costs 5. Moves go up, right, down, or left, and entering the start costs nothing.

Both algorithms are in `src/search.js`, separate from the page code. Dijkstra picks the next cell with a linear scan rather than a priority queue, so it suits small maps. The page uses a 12 × 20 grid; the search module accepts up to 10,000 cells.

The map is only in memory. Refreshing clears it. There's no diagonal movement or saved-map support.

## Tests

With Node 22+:

```sh
npm test
```

No npm install is needed. Tests check routes, walls, and weighted detours.

[MIT](LICENSE)
