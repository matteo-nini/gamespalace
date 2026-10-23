// Renderizza le scene HTML in MP4 (1920x1080, 30 fps) fotogramma per fotogramma.
//   node render.mjs                 → tutti i video di videos.json + loop completo
//   node render.mjs jackpot         → solo i video il cui nome contiene "jackpot"
//   node render.mjs sfondo          → solo le immagini statiche (PNG) il cui nome contiene "sfondo"
// Richiede Playwright (Chromium) e ffmpeg.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require("/opt/node-tools/node_modules/playwright")); }

const ROOT = dirname(fileURLToPath(import.meta.url));
const FPS = 30;
const OUT = join(ROOT, "out");
mkdirSync(OUT, { recursive: true });

const { videos, loop, immagini = [] } = JSON.parse(readFileSync(join(ROOT, "videos.json"), "utf8"));
const filter = process.argv[2];
const jobs = videos.filter((v) => !filter || v.name.includes(filter));
const stills = immagini.filter((v) => !filter || v.name.includes(filter));

function ffmpeg(args) {
  const p = spawn("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => p.on("close", (c) => (c ? rej(new Error("ffmpeg " + c)) : res())));
  return { stdin: p.stdin, done };
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

const sceneUrl = (job) => pathToFileURL(join(ROOT, "scenes", job.scene)).href + "?" + new URLSearchParams(job.params || {});
const seek = (ms) => page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), ms);

// Immagini statiche (PNG 1920x1080)
for (const job of stills) {
  await page.goto(sceneUrl(job), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await seek((job.at || 0) * 1000);
  await page.screenshot({ path: join(OUT, job.name + ".png") });
  console.log(job.name + ": ok →", join(OUT, job.name + ".png"));
}

for (const job of jobs) {
  await page.goto(sceneUrl(job), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const dur = await page.evaluate(() => Number(document.body.dataset.duration || 12));
  const frames = Math.round(dur * FPS);
  const out = join(OUT, job.name + ".mp4");
  const ff = ffmpeg(["-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out]);
  process.stdout.write(`${job.name}: ${frames} fotogrammi `);
  for (let f = 0; f < frames; f++) {
    await seek((f * 1000) / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % FPS === 0) process.stdout.write(".");
  }
  ff.stdin.end();
  await ff.done;
  console.log(" ok →", out);
}
await browser.close();

// Loop completo per i monitor: tutti i video in sequenza
if (!filter && loop) {
  const list = join(OUT, "concat.txt");
  writeFileSync(list, loop.order.map((n) => `file '${join(OUT, n + ".mp4")}'`).join("\n"));
  await ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", "-movflags", "+faststart", join(OUT, loop.name + ".mp4")]).done;
  console.log("loop →", join(OUT, loop.name + ".mp4"));
}
