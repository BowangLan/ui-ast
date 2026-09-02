# Layout primitives

Layout primitives encode qualitative spatial relationships, not CSS or measurement.

| Primitive | Semantics                                                     | Props                               |
| --------- | ------------------------------------------------------------- | ----------------------------------- |
| `Row`     | Horizontal composition in semantic source order               | `align`, `justify`                  |
| `Stack`   | Vertical composition in semantic source order                 | `align`, `justify`                  |
| `Grid`    | Two-dimensional tracks for comparable children                | optional positive integer `columns` |
| `Split`   | Two peer regions forming the dominant composition             | `primary` is `first` or `second`    |
| `Sidebar` | Secondary content or navigation at an edge of primary content | `position` is `left` or `right`     |
| `Spacer`  | Flexible separation between meaningful sibling groups         | no props                            |

`align` values are `start`, `center`, `end`, `baseline`, and `stretch`. `justify` values are `start`, `center`, `end`, `between`, `around`, and `evenly`.

Do not encode `gap`, `padding`, sizes, ratios, coordinates, wrapping thresholds, or breakpoints. `columns` is allowed because track count can change comparison and reading structure. Use `Spacer` sparingly; ordinary whitespace is not a node.
