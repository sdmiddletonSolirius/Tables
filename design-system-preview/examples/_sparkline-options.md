### Prototype sparkline macro: previewSparkline(params)

This is a local demonstration macro, not a published Design System option. Capture its output in a Nunjucks variable and pass that trusted markup to the native table cell's `value`. The build registers the `sparklineData` filter used by this macro; copying the macro alone into another project is not sufficient.

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| label | string | Yes | Non-empty description identifying the row and trend. Included in the visually hidden text alternative. |
| series | array of points | Yes | At least two points in chronological order. Each has a non-empty label and a finite numeric value. Missing values are not supported in this prototype; invalid data fails the build explicitly. |
| width | number | No | SVG width in pixels, default 160. Must be finite and at least 16. |
| height | number | No | SVG height in pixels, default 40. Must be finite and at least 16. |

### Point options: series[]

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| label | string | Yes | Period label, such as 2022. Included alongside the value in the text alternative. |
| value | number | Yes | Finite numeric value. Zero and negative values are supported. |

Points are equally spaced horizontally. Each sparkline scales independently to its own minimum and maximum, so compare the trend shape, not magnitudes between rows. Constant series render as a horizontal line. There is no zero baseline, shaded area, CSV loading or interactivity in this prototype.

The SVG is hidden from assistive technology; an adjacent visually hidden description lists every period and value. The latest value is also shown in its own numeric table cell.
