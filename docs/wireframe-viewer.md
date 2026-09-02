# Wireframe viewer

The repository includes a browser tool that renders restricted UI AST JSX as a semantic wireframe. It is a reference viewer, not a canonical visual design or an implementation generator.

## Run it

```sh
npm install
npm run dev
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

The viewer parses JSX rather than importing it as application code. It accepts the same constrained form defined by the spec: one JSX root, known primitives, literal props, literal text, and comments. It rejects function calls, spreads, member expressions, arbitrary JavaScript, and unknown primitives.

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

Primitives share profiles such as `control`, `input`, `media`, `collection`, and `region`. A renderer can therefore infer that `IconButton` is compact and square, `SearchInput` fills available inline space, and `Image` reserves a media-shaped region without requiring `width`, `height`, `gap`, or other Layer 3 props in the JSX.

Every rendered primitive is `flex: 0 0 auto` by default. Semantic primitives that explicitly represent flexible distribution—currently `Spacer`, equal-width tabs, and projected horizontal collection items—override that default in the renderer. A fill-profile child inside `Row` sizes from its intrinsic definition instead of claiming the entire row. Primitives such as `Image` may define compact intrinsic minimums for narrow containers; those remain part of the primitive definition rather than source JSX.

`Row` centers children on its cross axis by default. Explicit `align="start|center|end|baseline|stretch"` values override that component default.

The numeric minimums are heuristics of this viewer. They are part of the executable primitive definition, not serialized AST data and not a promise that another renderer will produce identical pixels.

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
- overlay primitives render in place so their anatomy remains inspectable;
- responsive behavior is the viewer's inference, because v0.1 has no responsive-variant grammar;
- source editing uses a plain text area rather than a full code editor; and
- the viewer does not yet expose a public package API.
