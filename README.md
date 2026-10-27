# Tables

Templates for tables created by the data visualisation team, including static, interactive, and chables.

This repository is a work-in-progress. It currently contains two table templates (ungrouped and grouped row) which defines the structure of the table.

## Preview locally

To view the five existing publication/embedded examples, run an HTTP server from the repository root:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000/>. The ungrouped and grouped template pages are also available at `/ungrouped-table/` and `/grouped-row-table/`. Use an HTTP server, not `file://`, because the tables load CSV data and JavaScript modules. The examples load D3 and Pym from the ONS CDN and a font from Google Fonts, so an internet connection is needed.

### Preview with the ONS Design System

The separate context preview uses a fixed version of the **published** `@ons/design-system` package, currently the `74.0.0-next.16` prerelease for testing the unreleased Design System in wide mode. Its layout uses `ons-container ons-container--wide`, with the width supplied by the package rather than a custom preview limit. This is a prerelease evaluation, not a stable-release recommendation. It builds a real Design System table from the package's Nunjucks macro as a reference and renders the existing configurable tables in the **same document** with the package's CSS. This small build is enough to test table markup and styling without migrating the working embeds into a prototype-kit project. Use the prototype-kit template if a full Design System page/layout and prototype navigation become requirements. Node.js and npm are needed for this optional preview:

```bash
npm ci
npm run build:preview
python3 -m http.server 8000
```

Open <http://localhost:8000/design-system-preview/> and choose one of the five configurations, including the long paginated example. The generated HTML, CSS and font assets are ignored by Git; run `npm run build:preview` after a fresh install or Design System version change. The original examples do not need npm. Run `npm test` to check the build, native macro output, assets and example links. Browser rendering still depends on the ONS CDN for D3 and Pym.

The installed package version is pinned in `package.json` and `package-lock.json`, rather than being fetched as `latest` on every run. To evaluate a newer published release, run `npm install --save-dev --save-exact @ons/design-system@<version>`, rebuild, run the tests and review **all five** configurations at narrow and wide widths. Keep the resulting lockfile change with the version change; do not edit the installed package directly.

### Nunjucks examples and options

After building the preview, open <http://localhost:8000/design-system-preview/nunjucks-examples.html> for a meeting demonstration of one ungrouped and one grouped-row table. Each example includes a live native `onsTable` rendering, its exact Nunjucks source, a rendered Markdown options table (expanded by default), and its generated HTML. This page works without CDN scripts.

The editable examples and shared `_macro-options.md` are in `design-system-preview/examples/`. The build renders both examples from their displayed source and converts the Markdown with `markdown-it`. Rebuild after editing them. The generated page is ignored by Git, like the existing preview.

This demonstrates one native component with two table structures, not a new Nunjucks interface to the JavaScript/CSV templates. Only the options exercised by these examples are documented. The grouped example uses native merged row headings (`rowspan`); it does not reproduce the publication template's complex header associations. The native macro applies `scope="row"` to those headings, so grouped associations require dedicated accessibility review before production use.

### What this checks

The embedded pages use their own `col--*`, `table-scroll` and pagination classes, plus local CSS. The context preview makes the dynamic table emit the Design System's `ons-table`, `ons-table__head`, `ons-table__row`, `ons-table__header`, `ons-table__cell` and numeric/top modifiers, alongside the native table. It loads the published CSS inside the same document and scopes its remaining visualisation-specific styling; simply wrapping the original Pym iframe in a styled page would not check this. The original embedded markup and CSS remain unchanged.

Captions and text alternatives for bars and sparklines use the Design System's `ons-u-vh` utility in the context preview, and the local `visually-hidden` class in embeds. These text alternatives should remain available to assistive technology without appearing beneath the graphics. Sparkline descriptions include the configured column title and the underlying values.

This is **not** a claim that all data visualisation features are native Design System components. Its Nunjucks table macro covers standard numeric cells, captions and row headers, with responsive/scrollable and sortable variants; the D3 tables also add category markers, arrows, bars, sparklines, grouped headers, sticky columns and client-side button pagination. The native pagination macro uses links and server-style URLs, so the table's client-side controls intentionally remain separate instead of borrowing incompatible `ons-pagination` classes. Compare both tables' DOM and appearance; check keyboard focus, pagination, header associations and horizontal scrolling on mobile before proposing a change upstream. Grouped-row header associations and the chart-like cells warrant dedicated accessibility review, not just a visual comparison.

For a Design System contribution, identify which behavior should become a native component versus stay a publication-specific embed, document the supported configuration and semantic markup, and attach narrow/wide, keyboard and screen-reader test evidence. The existing embedded HTML marks `#table-container` as `aria-hidden="true"`, which can hide its table from assistive technology; this is a pre-existing accessibility issue to resolve before claiming the embedded version is accessible. The context preview deliberately does not hide its table. The context preview exercises the published package but does not replace tests or review in the Design System repository.

* Ungrouped: rectangular table with no merged cells or grouping.
* Grouped row: where sets of rows belong to the some categories. Structure based on <https://www.w3.org/WAI/tutorials/tables/multi-level/#table-with-three-headers-related-to-each-data-cell>.

The following features have or will be available for each table template and can be switched on in the config files. The default is that all of these options (besides numbers and text) are switched off.

|                          | Ungrouped | Grouped row | Notes                    |
|--------------------------|-----------|-------------|--------------------------|
| **Visual features**      |           |             |                          |
| Numbers                  | Yes       | Yes         | Right aligned            |
| Text                     | Yes       | Yes         | Left aligned             |
| HTML Text                | Yes       | Yes         | Left aligned (or right)  |
| Category icons           | Yes       | Yes         |                          |
| Arrow icons              | Yes       | Yes         |                          |
| Sparklines               | Yes       | Yes         |                          |
| Bars                     | Yes       | Yes         |                          |
| Top left column title    | Yes       | No          |                          |
| Striped rows             | Yes       | Yes         |                          |
| **Interactive features** |           |             |                          |
| Pagination               | Yes       | Yes         | Default 10 rows per page |
| Freeze first column      | Yes       | Yes         |                          |
| Filtering                | No        | No          | Not implemented          |
| Sorting                  | No        | No          | Not implemented          |
| Search                   | No        | No          | Not implemented          |

## Usage notes

* When using these in a publication, the table title should begin with "Table X: ..." not "Figure X: ...".
* Modify the width of individual columns with CSS if required, e.g., to set the maximum width of the second column:

```css
table td:nth-child(2), table th:nth-child(2) {
    max-width: 100px !important;
}
```

## Other links

* ONS Design System Tables: [service-manual.ons.gov.uk/design-system/components/table](https://service-manual.ons.gov.uk/design-system/components/table)
* Formatting datasets: [service-manual.ons.gov.uk/content/content-types/datasets](https://service-manual.ons.gov.uk/content/content-types/datasets)

## Other templates

* Charts: [github.com/ONSdigital/Charts](https://github.com/ONSdigital/Charts)
* Maps: [github.com/ONSdigital/Maps](https://github.com/ONSdigital/Maps)
