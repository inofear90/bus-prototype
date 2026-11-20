// Ad-hoc styling check (Claude ⇄ Figma workflow, see docs/WORKFLOW.md).
//
// Design-system values must come from tokens (var(--…)) or typography classes (.t-…).
// Anything else is "ad-hoc" and is only allowed:
//   - inside an `overrides/` folder of a flow (src/flows/<flow>/overrides/…), or
//   - on a line marked with a comment containing `adhoc-ok: <reason>`.
//
// Output: errors (ad-hoc values outside those places) + an inventory of allowed ad-hoc values,
// so a reviewer (or Claude) can decide what to promote into the design system.
// Exit code 1 when there are errors.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(root, 'src');
const SKIP_DIRS = new Set(['tokens', 'gallery', 'node_modules']);
const SKIP_FILES = /(\.generated\.ts|\.test\.ts)$/;

const RULES = [
  { id: 'raw-color', re: /(#[0-9a-fA-F]{3,8}\b(?![-/])|\b(?:rgba?|hsla?)\()/ },
  { id: 'raw-font', re: /\b(font-size|font-weight|line-height|letter-spacing)\s*:\s*(?!var\()[\d.]/ },
  { id: 'raw-font', re: /\b(fontSize|fontWeight|lineHeight|letterSpacing)\s*:\s*['"]?[\d.]/ },
  { id: 'raw-shadow', re: /\bbox-shadow\s*:\s*(?!var\(|none)[^;]*\d+px/ },
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(name)) yield* walk(p); }
    else if (/\.(css|tsx?|mjs)$/.test(name) && !SKIP_FILES.test(name)) yield p;
  }
}

const errors = [];
const inventory = [];
const exceptions = [];
for (const file of walk(SRC)) {
  const rel = relative(root, file);
  const inOverrides = rel.includes('/overrides/');
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const rule of RULES) {
      if (!rule.re.test(line)) continue;
      const hit = { where: `${rel}:${i + 1}`, rule: rule.id, text: line.trim().slice(0, 110) };
      if (inOverrides) inventory.push(hit);
      else if (/adhoc-ok/.test(line)) exceptions.push(hit);
      else errors.push(hit);
      break;
    }
  });
}

const print = (title, list) => {
  if (!list.length) return;
  console.log(`\n${title} (${list.length})`);
  for (const h of list) console.log(`  ${h.where}  [${h.rule}]  ${h.text}`);
};
print('✖ Ad-hoc values outside overrides/ – move to tokens, an overrides/ file, or mark `adhoc-ok: <reason>`', errors);
print('• Ad-hoc inventory (overrides/) – candidates to promote into the design system', inventory);
print('• Documented exceptions (adhoc-ok)', exceptions);
if (!errors.length) console.log(`\n✓ No unreviewed ad-hoc values (${inventory.length} in overrides/, ${exceptions.length} documented exceptions).`);
process.exit(errors.length ? 1 : 0);
