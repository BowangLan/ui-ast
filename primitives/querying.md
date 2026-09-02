# Filtering and querying primitives

These primitives modify which records are shown or how they are ordered. They are separated from general inputs because their effect on a collection is their defining UI behavior.

| Primitive           | Semantics                                   | Notable props                                      |
| ------------------- | ------------------------------------------- | -------------------------------------------------- |
| `FilterBar`         | Region grouping persistent query controls   | `id`, optional `controls`; query-control children  |
| `FilterButton`      | Opens a general filter disclosure           | `action`, `label`, `controls`, `badge`, `expanded` |
| `SelectFilter`      | Compact single-choice filter                | `name`, `field`, `options`, `label`, `controls`    |
| `MultiSelectFilter` | Compact multiple-choice filter              | `name`, `field`, `options`, `label`, `controls`    |
| `SearchButton`      | Opens or initiates a search interface       | `action`, `label`, optional `controls`             |
| `SortButton`        | Opens or cycles sorting                     | `action`, `label`, `sortBy`, optional `controls`   |
| `SortSelect`        | Selects one visible sort order from choices | `name`, `options`, `sortBy`, `label`, `controls`   |

Use `SearchInput` when the text field is visible and `SearchButton` when activation reveals or initiates search. Use ordinary `Select` when the choice changes application data or navigation rather than filtering a collection.

Do not use a generic `Filter` primitive. The node must say whether filtering manifests as a button, select, multi-select, or composed bar.
