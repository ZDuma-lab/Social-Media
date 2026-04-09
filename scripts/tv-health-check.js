#!/usr/bin/env node
// TV Health Check — validates the Remotion video composition pipeline
// Checks: required files, TypeScript, ESLint, composition config, still render

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PASS = "\x1b[32m✓\x1b[0m";
const FAIL = "\x1b[31m✗\x1b[0m";
const SKIP = "\x1b[33m⊘\x1b[0m";
const INFO = "\x1b[36mℹ\x1b[0m";

let exitCode = 0;

function pass(msg) {
  console.log(`  ${PASS} ${msg}`);
}

function fail(msg) {
  console.log(`  ${FAIL} ${msg}`);
  exitCode = 1;
}

function skip(msg) {
  console.log(`  ${SKIP} ${msg}`);
}

function info(msg) {
  console.log(`  ${INFO} ${msg}`);
}

function isChromeNetworkError(e) {
  const combined = [e.stdout, e.stderr, e.message]
    .filter(Boolean)
    .map((b) => b.toString())
    .join("\n");
  return (
    combined.includes("no data for") ||
    combined.includes("ECONNREFUSED") ||
    combined.includes("ENOTFOUND") ||
    combined.includes("download file") ||
    combined.includes("Downloading Chrome")
  );
}

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: ROOT, stdio: "pipe", ...opts }).toString().trim();
}

function section(title) {
  console.log(`\n\x1b[1m${title}\x1b[0m`);
}

// ── 1. Required files ────────────────────────────────────────────────────────
section("1. Required files");

const REQUIRED = [
  "remotion/Root.tsx",
  "remotion/HowFaithWorks.tsx",
  "remotion/components/Background.tsx",
  "remotion/scenes/Scene1.tsx",
  "remotion/scenes/Scene2.tsx",
  "remotion/scenes/Scene3.tsx",
  "remotion/scenes/Scene4.tsx",
  "remotion/scenes/Scene5.tsx",
  "remotion/utils/springs.ts",
  "remotion/utils/fonts.ts",
  "public/music.wav",
];

for (const rel of REQUIRED) {
  const full = path.join(ROOT, rel);
  if (fs.existsSync(full)) {
    pass(rel);
  } else {
    fail(`${rel} — NOT FOUND`);
  }
}

// ── 2. Composition config ────────────────────────────────────────────────────
section("2. Composition config");

const rootSrc = fs.readFileSync(path.join(ROOT, "remotion/Root.tsx"), "utf8");

// Resolve TOTAL_FRAMES constant if used as a variable
const totalFramesMatch = rootSrc.match(/const\s+TOTAL_FRAMES\s*=\s*(\d+)/);
const resolvedFrames = totalFramesMatch ? totalFramesMatch[1] : "900";

const checks = [
  { label: 'id="HowFaithWorks"', re: /id=["']HowFaithWorks["']/ },
  {
    label: `durationInFrames=${resolvedFrames}`,
    re: new RegExp(`durationInFrames=\\{?(?:${resolvedFrames}|TOTAL_FRAMES)\\}?`),
  },
  { label: "fps=30", re: /fps=\{?30\}?/ },
  { label: "width=1080", re: /width=\{?1080\}?/ },
  { label: "height=1920", re: /height=\{?1920\}?/ },
];

for (const { label, re } of checks) {
  if (re.test(rootSrc)) {
    pass(label);
  } else {
    fail(`${label} — not found in remotion/Root.tsx`);
  }
}

// ── 3. TypeScript ────────────────────────────────────────────────────────────
section("3. TypeScript (tsc --noEmit)");

try {
  run("./node_modules/.bin/tsc --noEmit");
  pass("No type errors");
} catch (e) {
  const output = e.stdout ? e.stdout.toString() : e.message;
  fail("TypeScript errors detected");
  console.log(
    output
      .split("\n")
      .slice(0, 20)
      .map((l) => `     ${l}`)
      .join("\n")
  );
}

// ── 4. ESLint ────────────────────────────────────────────────────────────────
section("4. ESLint");

try {
  run("./node_modules/.bin/eslint remotion/ --max-warnings=0");
  pass("No lint errors");
} catch (e) {
  const output = e.stdout ? e.stdout.toString() : e.message;
  fail("ESLint errors detected");
  console.log(
    output
      .split("\n")
      .slice(0, 20)
      .map((l) => `     ${l}`)
      .join("\n")
  );
}

// ── 5. Remotion compositions ─────────────────────────────────────────────────
section("5. Remotion compositions");

try {
  // Allow longer timeout for first-run Chrome download
  const out = execSync(
    "./node_modules/.bin/remotion compositions remotion/Root.tsx --quiet",
    { cwd: ROOT, stdio: "pipe", timeout: 120000 }
  ).toString().trim();
  if (out.includes("HowFaithWorks")) {
    pass("HowFaithWorks composition registered");
  } else {
    fail("HowFaithWorks composition not found in output");
    info(out || "(no output)");
  }
} catch (e) {
  if (isChromeNetworkError(e)) {
    skip("Skipped — Chrome Headless Shell unavailable in this environment");
  } else {
    fail("Could not list compositions");
    const combined = [e.stdout, e.stderr].filter(Boolean).map((b) => b.toString()).join("\n");
    console.log(
      combined
        .split("\n")
        .filter((l) => l.trim() && !l.includes("Downloading"))
        .slice(0, 10)
        .map((l) => `     ${l}`)
        .join("\n")
    );
  }
}

// ── 6. Still-frame render ────────────────────────────────────────────────────
section("6. Still-frame render (frame 0)");

const stillOut = path.join(ROOT, "out", "health-check-still.png");
fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });

try {
  info("This may take a moment on first run (Chrome download)...");
  execSync(
    `./node_modules/.bin/remotion still remotion/Root.tsx HowFaithWorks ${stillOut} --frame=0 --log=error`,
    { cwd: ROOT, stdio: "pipe", timeout: 300000 }
  );
  const stat = fs.statSync(stillOut);
  if (stat.size > 0) {
    pass(`Rendered still to out/health-check-still.png (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    fail("Still rendered but file is empty");
  }
} catch (e) {
  if (isChromeNetworkError(e)) {
    skip("Skipped — Chrome Headless Shell unavailable in this environment");
  } else {
    fail("Still render failed");
    const combined = [e.stdout, e.stderr].filter(Boolean).map((b) => b.toString()).join("\n");
    console.log(
      combined
        .split("\n")
        .filter((l) => l.trim() && !l.includes("Downloading"))
        .slice(0, 20)
        .map((l) => `     ${l}`)
        .join("\n")
    );
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log("\n" + "─".repeat(50));
if (exitCode === 0) {
  console.log("\x1b[32m\x1b[1m  TV health check PASSED\x1b[0m\n");
} else {
  console.log("\x1b[31m\x1b[1m  TV health check FAILED — see above\x1b[0m\n");
}

process.exit(exitCode);
