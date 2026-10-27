import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";
import MarkdownIt from "markdown-it";
import { sparklineData } from "./sparkline.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const designSystem = path.join(root, "node_modules/@ons/design-system");
const output = path.join(root, "design-system-preview");
const loader = new nunjucks.FileSystemLoader([path.join(root, "design-system-preview"), designSystem]);
const environment = new nunjucks.Environment(loader, { autoescape: true });
environment.addFilter("sparklineData", sparklineData);

const packageInfo = JSON.parse(await readFile(path.join(designSystem, "package.json"), "utf8"));
const expectedVersion = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"))
  .devDependencies["@ons/design-system"];
if (packageInfo.version !== expectedVersion) {
  throw new Error(`Expected @ons/design-system ${expectedVersion}, found ${packageInfo.version}`);
}

await mkdir(path.join(output, "assets"), { recursive: true });
await cp(path.join(designSystem, "css"), path.join(output, "assets/css"), { recursive: true });
await cp(path.join(designSystem, "fonts"), path.join(output, "assets/fonts"), { recursive: true });
await writeFile(path.join(output, "index.html"), environment.render("index.njk", {
  designSystemVersion: packageInfo.version,
}));

const examples = await Promise.all([
  {
    key: "ungrouped",
    title: "Ungrouped table",
    description: "A rectangular table with one row heading and one numeric value per row.",
  },
  {
    key: "grouped",
    title: "Grouped-row table",
    description: "Two sets of rows, each with a group heading spanning two rows. Subsequent rows omit the occupied group cell.",
  },
  {
    key: "ungrouped-sparkline",
    title: "Ungrouped table with sparklines",
    description: "A native table with local prototype sparkline markup in its trend cells.",
    sparkline: true,
  },
  {
    key: "grouped-sparkline",
    title: "Grouped-row table with sparklines",
    description: "Merged group headings and a local prototype sparkline for each area, including a constant trend.",
    sparkline: true,
  },
].map(async example => {
  const source = await readFile(path.join(output, "examples", `${example.key}.njk`), "utf8");
  return { ...example, source, html: environment.renderString(source) };
}));
const markdown = new MarkdownIt({ html: false });
const optionsSource = await readFile(path.join(output, "examples/_macro-options.md"), "utf8");
const sparklineOptionsSource = await readFile(path.join(output, "examples/_sparkline-options.md"), "utf8");
const sparklineSource = await readFile(path.join(output, "examples/_sparkline.njk"), "utf8");
await writeFile(path.join(output, "nunjucks-examples.html"), environment.render("nunjucks-examples.njk", {
  designSystemVersion: packageInfo.version,
  examples,
  macroOptions: markdown.render(optionsSource),
  sparklineOptions: markdown.render(sparklineOptionsSource),
  sparklineSource,
}));
