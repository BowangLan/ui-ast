# Wireframe viewer

The repository includes a browser tool that renders restricted UI AST JSX as a semantic wireframe. It is a reference viewer, not a canonical visual design or an implementation generator.

## Run it

```sh
bun install
bun run dev
```

Paste JSX into the editor, open a local `.jsx` file, or choose one of the repository examples. The preview updates live. Canvas controls provide phone, tablet, desktop, and available-width views. “Anatomy” outlines primitive boundaries and reveals a node's name and intrinsic size profile on hover. “States” includes alternatives with `when`, such as `EmptyState` and `ErrorState`.

## Rendering path

```text
restricted JSX source
→ Babel JSX parser
→ validation against v0.1 syntax
→ React elements from the primitive registry
→ semantic HTML wireframe
```

The viewer parses JSX rather than importing it as application code. It accepts the same constrained form defined by the spec: one JSX root, known primitives, literal props, literal text, and comments. It rejects function calls, spreads, member expressions, arbitrary JavaScript, unknown primitives, and invalid geometry values.

## Executable primitive definitions

[`src/wireframe/primitives.tsx`](../src/wireframe/primitives.tsx) is the executable reference registry. Every entry combines:

- the canonical primitive name;
- its taxonomy category;
- an intrinsic size definition; and
- the React component that renders its wireframe form.

An intrinsic size is qualitative first:

```ts
interface IntrinsicSize {
  profile: string;
  inline: "fill" | "content" | "compact";
  block: "content" | "line" | "control" | "media" | "region";
  minInline?: number;
  minBlock?: number;
  compactMinInline?: number;
  compactMinBlock?: number;
  aspectRatio?: string;
}
```

Primitives share profiles such as `control`, `input`, `media`, `collection`, and `region`. A renderer can therefore infer that `IconButton` is compact and square, `SearchInput` fills available inline space, and `Image` reserves a media-shaped region when geometry props are absent.

Optional geometry is resolved after primitive styles, so it overrides only the property it names. The viewer supports canonical size and constraint props; uniform, axis, and edge spacing; flex weights and wrapping; grid spans; scroll and overflow behavior; sticky/fixed/absolute positioning; and anchored floating placement. Numeric values map from one Layer 2 reference unit to one CSS pixel.

The preview root establishes the viewport for `position="fixed"`. Anchored floating placement uses the current [CSS Anchor Positioning](https://drafts.csswg.org/css-anchor-position/) model (`anchor-name`, `position-anchor`, and `position-area`); browsers without it retain an absolute-position fallback inside the wireframe.

```jsx
<Row width="fill" gap={12}>
  <Stack flex={1}>…</Stack>
  <IconButton size={44} icon="filter" label="Filters" />
</Row>
```

Every rendered primitive and every internal flex item is `flex: 0 0 auto` by default. Semantic primitives that explicitly represent flexible distribution—currently `Spacer`, equal-width tabs, and projected horizontal collection items—override that default in the renderer. A fill-profile child inside `Row` sizes from its intrinsic definition instead of claiming the entire row. Primitives such as `Image` may define compact intrinsic minimums for narrow containers; those remain part of the primitive definition rather than source JSX.

`Row` centers children on its cross axis by default. Explicit `align="start|center|end|baseline|stretch"` values override that component default.

`Stack` renders without an implicit gap between children. This remains its inferred viewer convention. An explicit `gap` overrides it.

The numeric minimums are heuristics of this viewer. They are part of the executable primitive definition, not serialized AST data. Explicit canonical geometry is serialized and should reconstruct approximately consistently, but it is not a promise of pixel-identical output.

## Collection projection

Collection JSX contains one semantic item template. To make the structure visible without application data, the viewer projects representative repetition:

- `List`, `Feed`, and `Tree` show three template instances;
- `HorizontalList` shows three instances;
- `GridList` shows four instances;
- `GroupedList` shows two groups; and
- `DataTable` expands column definitions into a header and three representative rows.

This repetition is preview behavior only. It does not modify the source tree.

## Current limitations

- data bindings render as labeled placeholders rather than sample records;
- actions and destinations are visible but do not execute;
- overlay primitives render in place when positioning is omitted; explicit fixed, absolute, or anchored floating geometry activates spatial placement;
- responsive behavior is the viewer's inference, because v0.1 has no responsive-variant grammar;
- source editing uses a plain text area rather than a full code editor; and
- the viewer does not yet expose a public package API.
