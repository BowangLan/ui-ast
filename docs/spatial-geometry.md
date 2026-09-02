# Spatial geometry

Status: **normative for v0.1**

This document defines the optional geometry vocabulary of UI AST. Its target is a structurally faithful wireframe: given the JSX alone, a renderer should be able to place the major regions at approximately the same size and position, with the same grouping, hierarchy, and scrolling behavior as the observed interface.

Geometry is optional. Omitting every prop in this document remains conforming and preserves the original Layer 2 behavior: each primitive supplies intrinsic geometry and the renderer fills in the rest. Explicit geometry refines that inference; it does not replace the primitive model.

The resolution order is:

1. an explicit geometry prop on the node;
2. the primitive's intrinsic geometry definition; then
3. a renderer fallback.

An explicit prop overrides only the dimension or relationship it names. For example, `width={280}` does not erase an `Image` primitive's inferred aspect ratio, and `gap={12}` does not change its parent's inferred padding.

## 1. Coordinate and value model

Numeric geometry values are finite, unitless **reference units**. They represent logical screen distance at the viewport from which the UI was observed. The browser viewer maps one reference unit to one CSS pixel; native capture tools may normalize points or density-independent pixels into the same logical space.

Authors MUST NOT add units or expressions. `width={320}` is valid; `width="320px"`, `width="50%"`, `width="calc(100% - 24px)"`, and viewport units are not. This keeps the AST independent of CSS while retaining useful measured geometry.

Lengths used for size and spacing MUST be non-negative. Positional offsets (`top`, `right`, `bottom`, and `left`) MAY be negative because unusual overlapping layouts sometimes require them.

## 2. Geometry props

All props are optional and apply only where they have spatial meaning.

| Concern           | Props                                                         | Canonical values                                                  |
| ----------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| Size              | `width`, `height`                                             | `"fill"`, `"content"`, or a non-negative number                   |
| Square size       | `size`                                                        | a non-negative number; overridden per axis by `width` or `height` |
| Constraints       | `minWidth`, `maxWidth`, `minHeight`, `maxHeight`              | non-negative numbers                                              |
| Proportion        | `aspectRatio`                                                 | a positive number or compact ratio string such as `"16/9"`        |
| Sibling spacing   | `gap`, `rowGap`, `columnGap`                                  | non-negative numbers                                              |
| Inner spacing     | `padding`, `paddingX`, `paddingY`, and physical edge variants | non-negative numbers                                              |
| Outer exception   | `margin`, `marginX`, `marginY`, and physical edge variants    | non-negative numbers                                              |
| Flex flow         | `align`, `justify`, `alignSelf`, `flex`, `wrap`               | enumerations, a non-negative flex weight, or boolean `wrap`       |
| Grid              | `columns`, `columnSpan`, `rowSpan`                            | positive integers                                                 |
| Overflow          | `scroll`, `overflow`                                          | scroll direction or non-scrolling overflow behavior               |
| Position          | `position`, `top`, `right`, `bottom`, `left`                  | positioning mode and numeric offsets                              |
| Floating relation | `anchor`, `placement`                                         | a node `id` and a canonical relative placement                    |
| Text allocation   | `lines`                                                       | a positive integer                                                |

Physical edge variants are `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, and the corresponding `margin*` props. Prefer `paddingX`/`paddingY` and `marginX`/`marginY` when the two sides are equal. A specific edge overrides its axis or uniform shorthand.

## 3. Sizing

### 3.1 Canonical size concepts

- `"fill"` consumes the available space on that axis.
- `"content"` hugs the node's intrinsic content on that axis. `"hug"`, `"fit"`, and `"auto"` are non-canonical aliases and MUST NOT be serialized.
- A number reserves that many reference units.
- `flex={n}` gives a child a proportional share of its parent's remaining main-axis space. Siblings with `flex={1}` and `flex={2}` divide that space one-third/two-thirds.
- `aspectRatio="w/h"` constrains a derived axis without fixing both axes.

Use `size={44}` for a square control or media node rather than repeating equal `width` and `height`. If `size`, `width`, and `height` coexist, the axis-specific props win.

`minWidth`, `maxWidth`, `minHeight`, and `maxHeight` constrain an otherwise relational or content-derived size. Do not serialize CSS sizing formulas. Prefer:

```jsx
<Panel width="fill" maxWidth={720} />
```

over an implementation expression such as `width="min(100%, 720px)"`.

### 3.2 Inference and defaults

When size is omitted, renderers MUST consult the primitive definition. This preserves useful defaults such as a square `IconButton`, content-sized text, fill-width inputs and collections, and a media-shaped `Image`.

Omitted geometry MUST NOT be interpreted as zero. It means **infer**.

The reference viewer treats flex children as `flex: none` by default. Only an explicit `flex` prop or a primitive whose semantics intrinsically distribute available space, such as `Spacer`, may opt into growth. `Row` defaults to `align="center"`; other omitted alignment and spacing values continue to come from primitive definitions.

### 3.3 Exact dimensions versus relationships

Prefer a relationship when it explains the observed geometry:

```jsx
<Row width="fill" gap={12}>
  <Stack flex={1}>…</Stack>
  <IconButton size={44} />
</Row>
```

Preserve a numeric dimension when it is both observable and materially affects reconstruction, including:

- a control's hit area or repeated row height;
- a persistent sidebar, drawer, toolbar, or bottom bar width or height;
- a media thumbnail or chart viewport;
- a scroll viewport boundary;
- a deliberately constrained content column; or
- a page's reference viewport.

Do not measure every content-derived leaf. Small sub-pixel differences, antialiasing effects, border thickness, and dimensions caused only by typography belong to rendering or Layer 3. Measurements SHOULD be rounded to stable logical units when the source does not make the exact value meaningful.

## 4. Spacing

`gap` is the canonical way to describe regular space between a layout node's children. `rowGap` and `columnGap` are allowed when a grid or wrapping row has unequal axes; they override `gap` on their respective axes.

`padding` describes space between a meaningful container boundary and its children. It is appropriate on nodes such as `Page`, `Section`, `Panel`, `Card`, `ListItem`, and overlay regions when that inset materially affects geometry.

Margin is an escape hatch. Authors SHOULD first use, in order:

1. parent `gap` for regular sibling separation;
2. parent `padding` for container inset;
3. `justify` or `Spacer` for distribution; or
4. another meaningful layout group.

Use margin only for a real irregular external offset that belongs to one node and cannot be expressed by those relationships. Negative margin and `"auto"` margin are not part of v0.1. Empty layout wrappers MUST NOT be introduced only to manufacture whitespace.

Numeric spacing is geometry, not a styling token. Props such as `gap="space-3"` or `padding="comfortable"` remain Layer 3 and are forbidden.

## 5. Rows, stacks, flex, and alignment

`Row` and `Stack` establish the main axis. `align` controls the cross axis and uses `start`, `center`, `end`, `baseline`, or `stretch`. `justify` controls the main axis and uses `start`, `center`, `end`, `between`, `around`, or `evenly`.

`alignSelf` applies the same cross-axis vocabulary to one exceptional child. Prefer parent alignment when all children share the relationship.

`flex={n}` is a non-negative proportional weight, not CSS flex shorthand:

- omitted means the primitive-inferred behavior, which is `flex: none` for ordinary children in the reference viewer;
- `flex={0}` explicitly prevents growth and shrinkage; and
- a positive value grows and may shrink the child from a zero proportional basis.

Use `width="fill"` for a node that fills an available containing axis. Use `flex` when siblings divide remaining main-axis space. Do not use both merely to imitate an implementation.

`wrap` is boolean. Omit it for a single-line flow; use `wrap` only when wrapping is part of the observed composition. Source order remains semantic reading and focus order even when items wrap.

## 6. Grids and proportions

`Grid columns={n}` defines `n` equal logical tracks. Direct children MAY declare `columnSpan` and `rowSpan`; omitted spans are one. Spans MUST NOT exceed the intended grid without an explicit note that overflow is part of the source UI.

Use a grid when shared two-dimensional alignment is observable. Use a `Row` with `flex` weights for a one-dimensional proportional composition. Use `Split` when the two peer regions and their master/detail or primary/secondary relationship are more important than a track system; numeric child widths MAY refine a `Split` when its pane geometry is material.

The v0.1 grammar does not serialize arbitrary track formulas, named lines, masonry algorithms, or strings resembling `grid-template-columns`. A future compact track grammar remains an open question.

## 7. Scrolling and overflow

`scroll="vertical|horizontal|both"` declares a user-scrollable container and its axes. A scroll container SHOULD also have a numeric or otherwise constrained width or height so its viewport can be reconstructed. `ScrollPage` intrinsically implies vertical page scrolling unless an explicit `scroll` value refines it.

`overflow="visible|clip"` describes non-scrolling overflow. Use `clip` when cropping materially changes the visible geometry, for example a horizontal carousel preview. Use `scroll` rather than CSS-like `overflow="auto"` or `overflow="scroll"`.

`scroll` and `overflow` MUST NOT appear together on the same node. Scrollbar width, appearance, overscroll effects, scroll snapping, momentum, and scroll animation are outside v0.1.

## 8. Positioning and overlays

Omitted `position` means ordinary flow or primitive-inferred behavior. Explicit values are:

- `relative` — remains in flow and is offset from its flow position;
- `absolute` — leaves flow and uses offsets from the nearest enclosing Layer 2 node;
- `sticky` — begins in flow and pins within the nearest scroll container;
- `fixed` — leaves flow and is positioned against the page viewport; and
- `floating` — leaves flow and is placed relative to a node named by `anchor`.

At least one of `top`, `right`, `bottom`, or `left` SHOULD accompany `absolute`, `sticky`, or `fixed` unless a primitive supplies the omitted placement. Offsets are reference units, not CSS values.

`floating` MUST provide `anchor`, whose value is the lower-kebab-case `id` of another node. With `floating`, `placement` MAY be `top-start`, `top`, `top-end`, `right-start`, `right`, `right-end`, `bottom-start`, `bottom`, `bottom-end`, `left-start`, `left`, `left-end`, or `center`; it defaults to `bottom`. `fixed` MAY use the same `placement` vocabulary relative to the page viewport without an `anchor`.

```jsx
<IconButton id="more-actions" icon="menu" label="More actions" />
<Menu
  position="floating"
  anchor="more-actions"
  placement="bottom-end"
  width={220}
>
  …
</Menu>
```

Use primitive-specific `edge="left|right"` for the structural edge occupied by `Sidebar` or `Drawer`. `edge` and `placement` describe relationships; they do not expose CSS positioning.

Dialog, drawer, menu, popover, tooltip, toast, and other overlay primitives carry inferred modality and layering. Explicit size, position, anchor, placement, and offsets refine their geometry. Authors MUST NOT serialize `zIndex`; primitive semantics and source order determine the layering class.

## 9. Text and media

Do not infer or serialize typography to reproduce text geometry. Preserve visible text, its containing width, and—when important—its observed line allocation:

```jsx
<Text width="fill" lines={2} field="summary" />
```

`lines` is a positive count of allocated text lines under a neutral renderer, not a font size or line height. Use numeric `height` only when the text region has a fixed or aligned block extent that line count cannot express. A renderer remains free to use neutral typography, so exact glyph metrics are not a conformance target.

For images and other media, prefer one axis plus `aspectRatio`:

```jsx
<Image width={160} aspectRatio="16/9" field="coverImage" />
```

Specify both width and height when the observed crop or media viewport is intentionally non-proportional. Cropping mode, focal point, filters, masks, and visual treatment remain outside this geometry vocabulary.

## 10. Layer 2 versus Layer 3

Geometry belongs in Layer 2 only when it helps reconstruct size, position, grouping, hierarchy, or scrolling. The following remain Layer 3 and MUST NOT appear:

- color, opacity, gradients, textures, or materials;
- font family, font size, font weight, line height, or letter spacing;
- borders, divider strokes, corner radii, or shadows;
- styling tokens, density names, themes, classes, CSS, or style objects;
- decorative transforms, filters, and effects; and
- animation duration, easing, and transition treatment.

The same numeric value can be geometric in one context and visual in another. `height={44}` on a button preserves its occupied and interactive area; `borderRadius={22}` only describes treatment and is forbidden.

## 11. Escape hatches

Use increasingly specific escape hatches:

1. explicit numeric size and spacing;
2. min/max constraints, flex weights, and grid spans;
3. sticky, fixed, or anchored floating positioning;
4. `absolute` plus offsets for a genuinely freeform child; then
5. an experimental `X…` primitive for a recurring non-standard spatial system.

Absolute positioning MUST be local to the smallest meaningful parent. Do not flatten a screen into siblings with screenshot `x`/`y` coordinates. A freeform canvas, map annotation layer, node graph, or drag surface may justify local absolute children; ordinary application layout does not.

CSS strings, percentage strings, `calc`, transforms, arbitrary grid templates, media queries, and implementation callbacks are not escape hatches. If the vocabulary cannot express a layout without them, record an open question rather than embedding CSS in JSX.

## 12. Reference example

```jsx
<Page width={390} minHeight={844} padding={24}>
  <Stack gap={24}>
    <Header position="sticky" top={0}>
      <Row width="fill" gap={12}>
        <SearchInput flex={1} placeholder="Search projects" />
        <IconButton size={44} icon="filter" label="Filters" />
      </Row>
    </Header>

    <Grid columns={12} gap={16}>
      <Sidebar edge="left" columnSpan={4} height={560} scroll="vertical">
        …
      </Sidebar>
      <Panel columnSpan={8} minHeight={560} padding={20}>
        …
      </Panel>
    </Grid>
  </Stack>
</Page>
```

Removing every geometry prop from this example is valid. The result is less faithful but remains renderable because `Page`, `Stack`, `Header`, `SearchInput`, `IconButton`, `Grid`, `Sidebar`, and `Panel` retain intrinsic geometry definitions.
