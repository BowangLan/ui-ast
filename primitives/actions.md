# Action primitives

Action primitives expose commands or navigation.

| Primitive    | Semantics                               | Notable props                                                                         |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------- |
| `Button`     | Visible text command                    | `action`, `label`, `emphasis`, state props                                            |
| `IconButton` | Icon-only command or navigation control | `icon`, required `label`, `action` or `destination`, `emphasis`, `badge`, state props |
| `Link`       | Navigation expressed as linked content  | `destination`, optional `label`, state props                                          |
| `MenuButton` | Button that opens an action menu        | required `label`, optional `icon`, `controls`, `expanded`, state props                |

Allowed `emphasis` values are `primary`, `secondary`, and `danger`. Emphasis records decision hierarchy or destructive consequence; it does not prescribe appearance.

Use `IconButton` only when the observed control has no visible text. A button containing both icon and visible text remains `Button`; the icon may be described only when it materially aids recognition. Use `Link` for navigation and `Button` for commands. Menu contents may be represented by a related `Menu` when visible or relevant to the document's state.
