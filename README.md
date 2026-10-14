# Akshay Sharma — Portfolio

Creative/design portfolio built with HTML, CSS, and JavaScript. No build step is required.

## Preview locally

Run `python3 -m http.server 4173 --directory dist`, then open http://localhost:4173.

## Structure

- `dist/`: complete website, ready for static hosting.
- `dist/assets/`: images, portraits, CV, original music, and background videos.
- `tools/`: Python scripts used to generate the original background motion and music.
- `.openai/hosting.json`: existing Sites hosting configuration.

To regenerate media, install numpy, Pillow, imageio, and imageio-ffmpeg. The shipped assets are ready to use without running these scripts.

Live website: https://akshay-sharma-portfolio.mythicgrebe8.chatgpt.site/
