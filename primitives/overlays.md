# Overlay and disclosure primitives

These primitives expose content above, beside, or within an existing context. They identify interaction patterns, not z-index or animation.

| Primitive     | Semantics                                                 | Notable props and children                                        |
| ------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| `Menu`        | Temporary list of actions or destinations                 | `id`, optional `label`; `MenuItem` children                       |
| `MenuItem`    | One menu command or destination                           | `label`, `action` or `destination`, state props                   |
| `ContextMenu` | Menu invoked for a contextual target                      | `id`, `label`; `MenuItem` children                                |
| `Popover`     | Non-modal contextual disclosure anchored to a control     | `id`, `label`; composed content                                   |
| `Tooltip`     | Brief supplemental explanation for a referenced control   | `controls`; literal text or `Text`                                |
| `Dialog`      | Modal task, decision, or information region               | `id`, `label`; content and actions                                |
| `Drawer`      | Edge disclosure preserving context of the underlying view | `id`, `label`, `position`; content and actions                    |
| `Accordion`   | In-flow disclosure group                                  | `id`, optional `selection`; titled sections with `expanded` state |

The triggering control SHOULD reference the disclosed region through `controls`. Use `MenuButton` as the trigger for `Menu`; do not make `Menu` itself an action. `Dialog` and `Drawer` describe interaction modality and placement relationship, not surface styling.

Accordion item anatomy is not standardized in v0.1; use `Section` children and record `expanded` on the controlled section only when the intended relationship is unambiguous.
