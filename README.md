# 莲花因果棋 · Lotus Karma

A browser version of Snakes & Ladders played on the **莲池步步生莲** lotus-pond board.
Golden lotuses are the ladders (功德：行善晋升), purple lotuses are the snakes (因果：退步),
and the first player to reach **100 · 西方极乐世界** wins.

![A game in progress: a token climbing the golden path from 36 to 57](docs/screenshot.webp)

## Play

- 2–4 players, each seat human or computer, sharing one screen (pass and play).
- Click or tap the dice, or press <kbd>Space</kbd>, to roll.
- Chinese and English interface, sound on/off, and the game is saved in the browser, so a refresh
  picks up where you left off.

## Rules

The classic Snakes & Ladders rules, on the board exactly as drawn:

1. All tokens start on lotus 1 (起点) and move forward by the number rolled.
2. Stop on a golden lotus and you climb its golden path; stop on a purple lotus and you slide down
   its purple path. Passing over one without stopping does nothing.
3. The first token to reach 100 wins. When a roll would go past 100 you either stay where you are
   (classic, the default) or walk to 100 and bounce back for the extra pips; choose this under
   **New game**.

| Golden lotus (up) | 3 → 22 | 8 → 30 | 20 → 41 | 36 → 57 | 51 → 67 | 62 → 84 | 71 → 91 | 78 → 98 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Purple lotus (down)** | **16 → 6** | **28 → 9** | **45 → 25** | **54 → 34** | **64 → 47** | **74 → 53** | **89 → 68** | **95 → 75** |

## Run it locally

The game is plain HTML, CSS and JavaScript modules with no build step. Browsers only load modules
over HTTP, so serve the folder instead of opening `index.html` directly:

```sh
python3 -m http.server 8000   # or: npm start
# then open http://localhost:8000
```

Add `?speed=3` to the address to speed up the animations.

## Put it online with GitHub Pages

1. On GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick the branch that holds these
   files and the `/ (root)` folder, then **Save**.
3. After a minute the game is live at `https://<your-user>.github.io/snake-and-ladder-game/`.

Any static host (Netlify, Vercel, Cloudflare Pages, a plain web server) works the same way: upload
the folder as it is.

## Tests

```sh
npm test
```

The tests cover the rules (moves, ladders, snakes, both finishing rules, turn order, saved-game
validation, thousands of simulated games) and check that the board data matches the artwork.

## How it is built

| Path | What it holds |
| --- | --- |
| `index.html` | Page structure, dialogs and SVG icons |
| `css/style.css` | Layout and styling in the board's palette |
| `js/board-data.js` | Centre of every lotus, the ladders and snakes, and the traced golden/purple paths |
| `js/game.js` | The rules, with no DOM code, so they can be tested in Node |
| `js/main.js` | Tokens, dice, animations, turns, computer players, saving |
| `js/i18n.js` | Chinese and English text |
| `js/audio.js` | Sound effects synthesised with the Web Audio API |
| `assets/` | The board artwork, cut into the part above the control panel and the frame below it |

The board is the original artwork, unchanged. The dice and flower panel under it is rebuilt as a
working control in the same style: the dice rolls, and the four flowers show which seats are in
play and whose turn it is. Every lotus position and every golden and purple path was measured from
the artwork, so tokens land on the drawn lotuses and follow the drawn lines when they climb or
slide. If the artwork changes, those coordinates in `js/board-data.js` need to be measured again.
