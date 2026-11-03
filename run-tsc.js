import { spawnSync } from "node:child_process";

const ignoreErrors = new Set([
  // super() does not return void. See ECMA-262 13.3.7
  "2339",
  // "possibly undefined" is JS in two words.
  "2532",
  // we're not linting TS, we're linting JS, we don't care about "any" types.
  ...["2683", "7005", "7006", "7008", "7017", "7034", "7053"],
]);

console.log(`Running tsc...`);

const { stdout } = spawnSync(`npx tsc --pretty false`, {
  encoding: `utf8`,
  shell: true,
});

const kept = [];
let keep = false;
const lines = stdout.split(/\r?\n/);

for (const line of lines) {
  const match = line.match(/\(\d+,\d+\): error TS(\d+): /);
  if (match) keep = !ignoreErrors.has(match[1]);
  if (keep && line) kept.push(line);
}

if (kept.length) {
  console.error(kept.join(`\n`));
  process.exit(1);
}

console.log(`No problems found.`);
