import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import nunjucks from "nunjucks";
import MarkdownIt from "markdown-it";

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

test("the preview uses the design-system wide container without a custom width limit", async () => {
  const [html, css, previewCss] = await Promise.all([
    read("design-system-preview/index.html"),
    read("design-system-preview/assets/css/main.css"),
    read("design-system-preview/preview.css"),
  ]);

  assert.match(html, /<main class="ons-container ons-container--wide preview-layout">/);
  assert.match(css, /\.ons-container--wide\s*\{/);
  const layout = previewCss.match(/\.preview-layout\s*\{([^}]+)\}/);
  assert.ok(layout);
  assert.doesNotMatch(layout[1], /(?:max-)?width\s*:/);
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

test("the meeting page renders both examples from their displayed Nunjucks source", async () => {
  const html = await read("design-system-preview/nunjucks-examples.html");
  const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(
    path.join(root, "node_modules/@ons/design-system"),
  ), { autoescape: true });

  for (const key of ["ungrouped", "grouped"]) {
    const source = await read(`design-system-preview/examples/${key}.njk`);
    const rendered = environment.renderString(source);
    assert.ok(html.includes(rendered), `${key} renders the real native macro`);
    assert.ok(html.includes(nunjucks.lib.escape(source)), `${key} displays its exact escaped source`);
    assert.ok(html.includes(nunjucks.lib.escape(rendered)), `${key} displays its exact escaped HTML`);
    assert.match(rendered, /<caption class="ons-table__caption/);
    assert.match(rendered, /ons-table__cell--numeric/);
    assert.match(rendered, /scope="row"/);
    assert.match(rendered, /role="region"\s+aria-label=/);
    const body = rendered.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/)[1];
    assert.equal((body.match(/<tr\s/g) || []).length, key === "grouped" ? 4 : 2);
    assert.equal((body.match(/rowspan="2"/g) || []).length, key === "grouped" ? 2 : 0);
    assert.equal((body.match(/<t[dh]\s/g) || []).length, key === "grouped" ? 10 : 4);
  }
  assert.match(html, /Prototype limitation:/);
  assert.doesNotMatch(html, /<script/);
});

test("both examples display the shared Markdown options as real tables", async () => {
  const [html, markdown] = await Promise.all([
    read("design-system-preview/nunjucks-examples.html"),
    read("design-system-preview/examples/_macro-options.md"),
  ]);
  const options = new MarkdownIt({ html: false }).render(markdown);
  assert.equal(html.split(options).length - 1, 2);
  assert.equal((options.match(/<table>/g) || []).length, 4);
  for (const name of ["caption", "ariaLabel", "ths", "trs", "tds", "value", "heading", "numeric", "rowspan"]) {
    assert.ok(options.includes(`<td>${name}</td>`), `${name} is documented`);
  }
  assert.equal((html.match(/<details class="preview-documentation" open>/g) || []).length, 2);
  assert.doesNotMatch(html, /<td>\s*\|/);
});

test("the existing preview links to the standalone meeting demonstration", async () => {
  const html = await read("design-system-preview/index.html");
  assert.match(html, /href="\.\/nunjucks-examples\.html"/);
});
