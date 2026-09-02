# Structure primitives

Structure primitives establish meaningful regions. They do not imply boxes, backgrounds, or spacing.

| Primitive    | Semantics                                                                    | Notable props and children                          |
| ------------ | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| `Page`       | One complete screen or navigable view                                        | `id`; regions and layout children                   |
| `ScrollPage` | A complete view whose page-level scrolling is an important interaction       | `id`; regions and layout children                   |
| `Section`    | A thematically grouped region within a page                                  | `id`, optional `label`; usually a title and content |
| `Panel`      | A persistent, bounded functional region                                      | `id`, optional `label`; content and actions         |
| `Header`     | Introductory or control region for its nearest page, section, or panel       | layout, display, and action children                |
| `Footer`     | Concluding or persistent action/information region for its nearest container | layout, display, and action children                |

Use `ScrollPage` only when page-level scrolling materially distinguishes the observed interaction. Do not use it merely because content might overflow.

`Panel` must reflect functional grouping or independent region behavior. A background, border, or shadow alone does not justify it. `Header` and `Footer` describe region roles; they do not imply fixed positioning.
