# Structure primitives

Structure primitives establish meaningful regions. They do not imply boxes, backgrounds, or other visual surface treatment. Their geometry is inferred from primitive definitions unless optional canonical props refine it.

| Primitive    | Semantics                                                                    | Notable props and children                          |
| ------------ | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| `Page`       | One complete screen or navigable view                                        | `id`; optional reference viewport geometry          |
| `ScrollPage` | A complete view whose page-level scrolling is an important interaction       | `id`; intrinsic vertical scrolling; viewport height |
| `Section`    | A thematically grouped region within a page                                  | `id`, optional `label`; usually a title and content |
| `Panel`      | A persistent, bounded functional region                                      | `id`, optional `label`; content and actions         |
| `Header`     | Introductory or control region for its nearest page, section, or panel       | layout, display, and action children                |
| `Footer`     | Concluding or persistent action/information region for its nearest container | layout, display, and action children                |

Use `ScrollPage` only when page-level scrolling materially distinguishes the observed interaction. It infers `scroll="vertical"`; an explicit `scroll` may refine the axes. A numeric or constrained height is useful when the scroll viewport is material.

`Panel` must reflect functional grouping or independent region behavior. A background, border, or shadow alone does not justify it. `Header` and `Footer` describe region roles; they do not imply fixed positioning. Use optional `position="sticky|fixed"` only when that behavior is observed.
