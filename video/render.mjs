// Renderizza le scene HTML in MP4 (1920x1080, 30 fps) fotogramma per fotogramma e monta i canali per le TV.
//   node render.mjs              → tutte le scene, i canali TV e le immagini statiche
//   node render.mjs jackpot      → solo le scene/immagini il cui nome contiene "jackpot" (i canali non vengono rimontati)
//   node render.mjs canali       → rimonta solo i canali TV (e le versioni lunghe) dalle scene già renderizzate
//   node render.mjs lunghi       → solo le versioni lunghe (es. 1 ora) dei canali, in out/lunghi/
// Codifica pensata per TV e lettori USB datati: H.264 High@4.0, 25 fps, bitrate limitato, keyframe ogni 2 s.
// Durante il render ogni testo visibile viene controllato: se esce dall'area sicura TV o dal suo riquadro, il render si ferma.
// Richiede Playwright (Chromium) e ffmpeg.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import os from "node:os";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require("/opt/node-tools/node_modules/playwright")); }

const ROOT = dirname(fileURLToPath(import.meta.url));
const FPS = 25;
const OUT = join(ROOT, "out");
const OUT_SCENE = join(OUT, "scene");
mkdirSync(OUT_SCENE, { recursive: true });

const { scene, canali, immagini = [], lunghi } = JSON.parse(readFileSync(join(ROOT, "videos.json"), "utf8"));
const filter = process.argv[2];
const onlyLong = filter === "lunghi";
const onlyChannels = filter === "canali" || onlyLong;
const jobs = onlyChannels ? [] : scene.filter((v) => !filter || v.name.includes(filter));
const stills = onlyChannels ? [] : immagini.filter((v) => !filter || v.name.includes(filter));

function ffmpeg(args) {
  const p = spawn("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => p.on("close", (c) => (c ? rej(new Error("ffmpeg " + c)) : res())));
  return { stdin: p.stdin, done };
}
const sceneUrl = (job) => pathToFileURL(join(ROOT, "scenes", job.scene)).href + "?" + new URLSearchParams(job.params || {});
const seek = (page, ms) => page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), ms);
async function open(page, job) {
  await page.goto(sceneUrl(job), { waitUntil: "load" });
  await page.waitForSelector("body[data-ready]");
}

const browser = await chromium.launch();

// Immagini statiche: PNG in 4K (3840x2160)
if (stills.length) {
  const hi = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  for (const job of stills) {
    await open(hi, job);
    await seek(hi, (job.at || 0) * 1000);
    await hi.screenshot({ path: join(OUT, job.name + ".png") });
    console.log(job.name + ".png ok");
  }
  await hi.close();
}

async function renderScene(page, job) {
  await open(page, job);
  const dur = await page.evaluate(() => Number(document.body.dataset.duration || 10));
  const frames = Math.round(dur * FPS);
  const out = join(OUT_SCENE, job.name + ".mp4");
  const ff = ffmpeg(["-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-profile:v", "high", "-level:v", "4.0", "-maxrate", "8M", "-bufsize", "16M",
    "-g", String(FPS * 2), "-pix_fmt", "yuv420p", "-r", String(FPS), "-movflags", "+faststart", out]);
  const problems = new Map();
  let prev = new Set();
  for (let f = 0; f < frames; f++) {
    await seek(page, (f * 1000) / FPS);
    if (f % 5 === 0) {
      // un difetto conta solo se persiste su due controlli consecutivi (esclude i passaggi di animazione)
      const now = new Set(await page.evaluate(() => checkText()));
      for (const p of now) if (prev.has(p) && !problems.has(p)) problems.set(p, (f / FPS).toFixed(1) + "s");
      prev = now;
    }
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await ff.done;
  if (problems.size) throw new Error(job.name + ": testi tagliati\n" + [...problems].map(([p, t]) => `  ${t}  ${p}`).join("\n"));
  console.log(`${job.name}.mp4 ok (${dur}s)`);
}

// Più scene in parallelo
const queue = [...jobs];
const workers = Math.max(1, Math.min(3, os.cpus().length - 1));
await Promise.all(Array.from({ length: workers }, async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  while (queue.length) await renderScene(page, queue.shift());
  await page.close();
}));
await browser.close();

async function concat(names, out) {
  const list = out + ".txt";
  writeFileSync(list, names.map((n) => `file '${join(OUT_SCENE, n + ".mp4")}'`).join("\n"));
  await ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", "-movflags", "+faststart", out]).done;
  rmSync(list);
}
const sceneDur = (n) => scene.find((s) => s.name === n) ? durations[n] : 0;
const durations = {};
async function probe(n) {
  const p = spawn("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", join(OUT_SCENE, n + ".mp4")]);
  let o = ""; p.stdout.on("data", (d) => (o += d));
  await new Promise((r) => p.on("close", r));
  durations[n] = Number(o);
}

// Canali per le TV: scene diverse in ordine diverso, da mandare in loop continuo
if (!filter || filter === "canali") {
  for (const ch of canali) {
    await concat(ch.order, join(OUT, ch.name + ".mp4"));
    console.log(ch.name + ".mp4 ok");
  }
}

// Versioni lunghe: lo stesso canale ripetuto per N minuti in un unico file, con l'ordine delle scene
// rimescolato a ogni giro (mai la stessa scena due volte di fila). Un solo file = nessun cambio video sulle TV.
if ((!filter || onlyChannels) && lunghi) {
  const dir = join(OUT, "lunghi");
  mkdirSync(dir, { recursive: true });
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (const ch of canali) {
    for (const n of ch.order) if (!(n in durations)) await probe(n);
    const seq = []; let total = 0, order = [...ch.order];
    while (total < lunghi.minuti * 60) {
      for (const n of order) { seq.push(n); total += sceneDur(n); }
      do { // nuovo ordine: mescolato, senza ripetere l'ultima scena del giro precedente
        for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      } while (order[0] === seq[seq.length - 1]);
    }
    const out = join(dir, `${ch.name}-${lunghi.minuti}min.mp4`);
    await concat(seq, out);
    console.log(`${ch.name}-${lunghi.minuti}min.mp4 ok (${Math.round(total / 60)} min)`);
  }
}
