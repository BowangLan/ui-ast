# Complex UI primitives

Complex primitives are provisional escape hatches for established interaction forms whose spatial or behavioral identity would be lost in generic composition.

| Primitive  | Semantics                                                   | Notable props                                             |
| ---------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| `Timeline` | Items positioned by sequence or time along an axis          | `source`, optional `selection`                            |
| `Calendar` | Date-grid or date-period interface                          | `source`, `value`, `selection`, `action`                  |
| `Schedule` | Time-slotted agenda with duration and overlap relationships | `source`, `value`, `selection`, `action`                  |
| `Kanban`   | Records grouped into movable workflow columns               | `source`, `groupBy`, `selection`, `action`                |
| `Chart`    | Data encoded graphically for comparison or trend perception | `source`, `kind`, `label`, optional `selection`, `action` |

Complex nodes SHOULD still expose meaningful surrounding titles, filters, legends, and actions through ordinary primitives. They MUST NOT carry visual-encoding props such as colors, stroke widths, chart pixel sizes, or animation timing.

Allowed `Chart kind` values are not standardized in v0.1. Internal anatomy, direct manipulation, event templates, axes, and legends are open questions. Authors SHOULD document an experimental extension when the opaque primitive would omit information essential to the task.
