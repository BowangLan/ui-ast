# Collection primitives

Collection primitives describe the concrete form in which repeated entities appear.

| Primitive        | Semantics                                                       | Notable props and children                                                         |
| ---------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `List`           | Vertical sequence of comparable items                           | `source`, `selection`; one item template                                           |
| `HorizontalList` | Horizontally traversed sequence                                 | `source`, `selection`; one item template                                           |
| `ListItem`       | Repeated item scope in a list or feed                           | `entity`, `selected`, optional `action` or `destination`                           |
| `GridList`       | Repeated items in two-dimensional tracks                        | `source`, `columns`, `selection`; one item template                                |
| `Card`           | Self-contained item or region with meaningful internal grouping | `entity`, optional `action` or `destination`; composed children                    |
| `DataTable`      | Column-aligned records supporting scanning and comparison       | `source`, required row `entity`, `selection`, `sortBy`; `TableColumn` declarations |
| `TableColumn`    | One visible semantic column                                     | `field`, `label`, optional `kind`, `sortBy`; optional cell template                |
| `Tree`           | Hierarchical collection with disclosure                         | `source`, `selection`; `TreeItem` template                                         |
| `TreeItem`       | Hierarchical item with possible descendants                     | `entity`, `expanded`, `selected`, optional `destination`                           |
| `Feed`           | Continuing chronologically or algorithmically ordered stream    | `source`; one `ListItem` template                                                  |
| `GroupedList`    | Items partitioned into visibly headed groups                    | `source`, `groupBy`; one `Group` template                                          |
| `Group`          | Repeated group scope and visible heading                        | `entity`; heading plus one nested collection                                       |

Allowed `selection` values are `none`, `single`, and `multiple`. Omit `selection` when the collection is not selectable. `columns` has the same semantic limits as `Grid columns`.

`DataTable entity` establishes the current row entity for every column. A column may contain a display or action template when `field` alone does not preserve the visible cell form. The exact interchange grammar for those templates remains open.

Use `Card` only when self-contained grouping, activation, or actions are part of the concrete pattern—not because an item has a border, shadow, or rounded background. Recursive tree binding remains an open question.
