# Display primitives

Display primitives communicate information without themselves accepting user input.

| Primitive      | Semantics                                                 | Notable props                                                    |
| -------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `Text`         | General visible text                                      | `field`, `value`; `kind` is `body`, `description`, or `metadata` |
| `Title`        | A heading in the information hierarchy                    | `field`, `value`; `level` is `page`, `section`, or `item`        |
| `Description`  | Explanatory text associated with nearby content           | `field`, `value`                                                 |
| `Metadata`     | Secondary identifying or contextual text                  | `field`, `value`                                                 |
| `Image`        | Meaningful image content                                  | `field`, `source`, `label`                                       |
| `Avatar`       | Image or fallback identifying a person or actor           | `field`, `source`, `label`                                       |
| `Icon`         | Meaning-bearing non-interactive symbol                    | `icon`, `label` when meaning is not adjacent                     |
| `BrandMark`    | A visible product or organization identity mark           | `name`, optional `field`                                         |
| `Badge`        | Compact categorical status or count                       | `field`, `value`, optional `label`                               |
| `Metric`       | Quantitative value whose magnitude is emphasized          | `field`, `value`, optional `label`                               |
| `Progress`     | Progress toward a bounded completion state                | `field`, `value`, optional `label`                               |
| `Code`         | Code or machine-readable text whose code semantics matter | `field`, `value`, optional `language`                            |
| `Date`         | Date or date-time represented as such                     | `field`, `value`                                                 |
| `RelativeTime` | Time relative to the current moment                       | `field`, `value`                                                 |
| `IconText`     | A semantic icon paired with a short value                 | `icon`, `field`, `value`, optional `label`                       |

Literal text may be a child instead of `value`. Do not specify display formats, truncation sizes, font treatment, image dimensions, crop, or icon libraries.

`Description` and `Metadata` remain provisional aliases for common `Text kind` roles. Canonical v0.1 examples prefer `Text kind` unless the dedicated role is being evaluated. Decorative images and icons are omitted.
