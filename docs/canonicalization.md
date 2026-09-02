# Canonicalization

Canonicalization makes independently authored trees easier to compare. These rules are normative for v0.1 examples.

## Choose the most specific concrete primitive

| Avoid                                  | Use                                          | Reason                                         |
| -------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| `<TextInput role="search" />`          | `<SearchInput />`                            | Search has a recognized input behavior.        |
| `<Button icon="trash" />` with no text | `<IconButton icon="trash" label="Delete" />` | Icon-only activation is a distinct affordance. |
| `<Button role="link" />`               | `<Link destination="…" />`                   | Navigation and command activation differ.      |
| `<Select purpose="sort" />`            | `<SortSelect />`                             | Sorting is a recognizable query control.       |
| `<Project />`                          | `<ListItem entity="project">…</ListItem>`    | The node must identify UI form.                |

Do not create capability-only names such as `Search`, `Filter`, or `Navigate` when the screen exposes a specific control.

## Use layout by reading direction

- Use `Row` when siblings are primarily composed horizontally.
- Use `Stack` when siblings are primarily composed vertically.
- Use `Grid` for repeated two-dimensional tracks.
- Use `Split` for two peer regions whose relationship is the dominant page structure.
- Use `Sidebar` for a secondary edge region, not merely any narrow column.
- Do not add `Row` or `Stack` solely to avoid putting `gap` or `padding` on the parent that owns the space.

Source order is semantic reading and traversal order. `position` and alignment props may refine it but must not contradict it.

## Refine inferred geometry only when useful

- Omit geometry when a primitive's intrinsic definition reconstructs the observed form adequately.
- Use `"fill"` and `"content"`; do not serialize `"100%"`, `"hug"`, `"fit"`, or `"auto"`.
- Use `size={44}` instead of equal `width` and `height` on a square element.
- Use `flex` for proportional siblings and grid spans for shared tracks.
- Use parent `gap`, then parent `padding`, before using a child margin.
- Use numeric dimensions for consequential viewport, pane, control, row, and media geometry—not every text glyph box.
- Use anchored `floating` positioning before absolute offsets for menus, popovers, and tooltips.

Explicit props override only the geometry they name. Omitted geometry continues to be inferred from the primitive definition.

## Separate collection, item, and item layout

Use a collection primitive for repetition, an item primitive for the repeated scope, and layout nodes inside the item:

```jsx
<List source="events">
  <ListItem entity="event">
    <Row>…</Row>
  </ListItem>
</List>
```

Use `Card` only when items visibly manifest as self-contained card surfaces with their own grouping or actions. Do not use `Card` as a generic container.

## Prefer props for references, children for visible content

Use `field="name"` when content comes from the current entity and `value="Draft"` for a literal semantic value. Use text children for literal visible copy, especially headings and instructions. Do not duplicate the same content in both forms.

```jsx
<Title field="name" />
<Badge value="Draft" />
<Title level="section">Recent activity</Title>
```

## Use shared interaction references

- `action` names a command, such as `archive-project`.
- `destination` names navigation, such as `project-details`.
- `label` supplies an accessible name when visible children do not.
- `controls` may name the region affected by disclosure or selection.

Do not encode handlers (`onClick`), URLs containing implementation routing, or function bodies.

## Express state on the node that presents it

Use the standard state props (`selected`, `checked`, `expanded`, `disabled`, `busy`, `invalid`) rather than state-specific wrapper names. Use `LoadingState`, `EmptyState`, or `ErrorState` when the state replaces or occupies a meaningful region.

## Avoid decorative nodes

Do not represent decorative separators, backgrounds, shadows, or ornamental icons. Represent an icon when it communicates meaning or is part of an affordance. Use `Spacer` only when consuming remaining space is meaningful, such as pushing footer actions to an edge; use `gap` for regular whitespace.

## Normalize shallow ambiguity

- Use `Title level="page|section|item"` rather than `PageTitle`, `SectionTitle`, and `ItemTitle` primitives.
- Use `Text kind="description|metadata"` for ordinary text roles; use `Description` or `Metadata` only when the distinction itself is important to a downstream task. v0.1 keeps the named primitives provisionally but examples prefer `Text kind`.
- Use `Select` for a compact choice control, including the location chooser in the event-feed example. `SelectButton` is not a v0.1 primitive.
- A `GroupedList` contains `Group` scopes. Each `Group` should provide a visible header and one collection of items.
