# Interval Timer

A simple browser-based stopwatch that speaks out the elapsed time at a
configurable interval — e.g. "5 seconds", "10 seconds", "1 minute" — using
the Web Speech API.

## Files

- `index.html` — main page
- `style.css` — UI styling
- `app.js` — timer and speech-announcement logic

## How to use

1. Open `index.html` in a browser.
2. Pick how often it should announce the elapsed time from the "Announce
   every" dropdown (5, 10, 15, 30, or 60 seconds).
3. Tap `Start` to begin counting up.
4. Tap `Stop` to pause, or `Reset` to return to `00:00`.

## Publish on GitHub Pages

1. Push these files to a GitHub repository.
2. In the repository settings, enable GitHub Pages using the `main` branch.
3. GitHub will provide a link like `https://<your-username>.github.io/<repo-name>/`.
4. Open that link on your phone or computer.

## Notes

- Announcements use `speechSynthesis` (Web Speech API), supported in Safari,
  Chrome, and most modern mobile browsers.
- Speech synthesis is unlocked by the `Start` tap, which is required by iOS
  Safari before any audio/speech can play.
