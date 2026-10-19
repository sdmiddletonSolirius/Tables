import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => readFile(path.join(root, file), "utf8");

test("the context preview renders the installed native table macro", async () => {
  const [html, installed] = await Promise.all([
    read("design-system-preview/index.html"),
    read("node_modules/@ons/design-system/package.json").then(JSON.parse),
  ]);

  assert.match(html, new RegExp(`Using @ons/design-system ${installed.version.replaceAll(".", "\\.")}`));
  assert.match(html, /ons-table-scrollable__content/);
  assert.match(html, /ons-table__header\s+ons-table__header--top/);
  assert.match(html, /ons-table__cell/);
  assert.match(html, /assets\/css\/main\.css/);
  assert.doesNotMatch(html, /lib\/globalStyle\.css|lib-tables\/tableStyle\.css/);
});

test("the preview copies the design-system stylesheet and its relative fonts", async () => {
  const [css, font] = await Promise.all([
    read("design-system-preview/assets/css/main.css"),
    stat(path.join(root, "design-system-preview/assets/fonts/opensans-regular.woff2")),
  ]);

  assert.match(css, /ons-table__cell/);
  assert.ok(font.size > 0);
});

test("all five example configurations are available in the context preview", async () => {
  const [html, loader] = await Promise.all([
    read("design-system-preview/index.html"),
    read("design-system-preview/preview.js"),
  ]);
  for (const example of [
    "example1-ungrouped-basic",
    "example2-ungrouped-complex",
    "example5-ungrouped-basic-long",
    "example3-grouped-row-basic",
    "example4-grouped-row-complex",
  ]) {
    assert.ok(html.includes(`?example=${example}`));
    assert.ok(loader.includes(`"${example}"`));
    await stat(path.join(root, "examples", example, "data.csv"));
  }
});
