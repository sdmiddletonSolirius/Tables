import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nunjucks from "nunjucks";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const designSystem = path.join(root, "node_modules/@ons/design-system");
const output = path.join(root, "design-system-preview");
const loader = new nunjucks.FileSystemLoader([path.join(root, "design-system-preview"), designSystem]);
const environment = new nunjucks.Environment(loader, { autoescape: true });

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
