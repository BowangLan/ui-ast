# Layout primitives

Layout primitives encode spatial relationships. Optional canonical geometry props refine those relationships; when they are omitted, renderers infer geometry from each primitive.

| Primitive | Semantics                                                     | Notable props                                      |
| --------- | ------------------------------------------------------------- | -------------------------------------------------- |
| `Row`     | Horizontal composition in semantic source order               | `align`, `justify`, `gap`, `wrap`                  |
| `Stack`   | Vertical composition in semantic source order                 | `align`, `justify`, `gap`                          |
| `Grid`    | Two-dimensional tracks for comparable children                | positive integer `columns`; child grid spans       |
| `Split`   | Two peer regions forming the dominant composition             | `primary` is `first` or `second`; child dimensions |
| `Sidebar` | Secondary content or navigation at an edge of primary content | `edge` is `left` or `right`                        |
| `Spacer`  | Flexible separation between meaningful sibling groups         | intrinsic flexibility; optional `flex`             |

`align` values are `start`, `center`, `end`, `baseline`, and `stretch`. `Row` uses `center` when `align` is omitted; an explicit value overrides the default. `justify` values are `start`, `center`, `end`, `between`, `around`, and `evenly`.

`flex` applies to a child of a `Row` or `Stack`; it is a proportional weight, not CSS shorthand. A `Grid` child may use positive integer `columnSpan` and `rowSpan`. Every ordinary flex child is non-growing and non-shrinking by default in the reference viewer; explicit `flex` or a primitive-defined behavior such as `Spacer` may override that default.

Numeric geometry is optional. Use parent `gap` for regular sibling separation and parent `padding` for container inset. Use `Spacer` only when consuming remaining space is the relationship itself. See [Spatial geometry](../docs/spatial-geometry.md) for the complete grammar and the Layer 2/Layer 3 boundary.
