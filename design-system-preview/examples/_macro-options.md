| Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | string | No | Identifies the table's figure wrapper. Use a unique value for each example on a page. |
| caption | string | No | Caption rendered inside the table. Both examples supply one to describe their illustrative data. |
| ariaLabel | string | No | Accessible name for the horizontally scrollable region. Both examples match this to their caption. |
| ths | array of header cells | Yes, for these examples | Column headings. The native macro also supports thList for multiple header rows; that is outside these examples. |
| trs | array of rows | Yes | Body rows. Each row has a tds array of cells. |

### Column heading options: ths[]

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| value | string | Yes | Text for the column heading. |
| numeric | boolean | No | Set to true to right-align a numeric column heading. Also set numeric on its body cells. |

### Row options: trs[]

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| tds | array of cells | Yes | Cells in this row, in column order. Omit a cell when a rowspan from a previous row already occupies its column. |

### Cell options: trs[].tds[]

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| value | string | Yes | Cell content. These examples use plain text; the native macro treats values as trusted HTML, so do not pass untrusted input. |
| heading | boolean | No | Set to true to render a row header rather than a data cell. The native macro applies scope="row". |
| numeric | boolean | No | Set to true to right-align a numeric cell. |
| rowspan | integer | No | Number of rows occupied by the cell. The grouped example uses 2 for each group heading. Omit on ordinary cells. |
