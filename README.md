# UI AST

UI AST is an experimental JSX vocabulary for describing the concrete structure and behavior of user interfaces without describing their visual styling or implementation.

It occupies **Layer 2** between a product's information model and its visual design:

1. **Layer 1 — information:** domain entities, data, and product concepts
2. **Layer 2 — UI form:** hierarchy, spatial composition, controls, affordances, and visible state
3. **Layer 3 — visual treatment:** color, typography, borders, shadows, radii, materials, and styling tokens

Prose is often too ambiguous for structural UI work, while screenshots mix structure with visual treatment and application code mixes UI intent with framework details. UI AST is a small intermediate representation that preserves recognizable UI form while leaving implementation and visual design open.

```jsx
<Page id="projects">
  <Row width="fill" gap={12} justify="between">
    <Title level="page">Projects</Title>
    <SearchInput
      width={280}
      placeholder="Search projects"
      action="search-projects"
    />
  </Row>

  <List source="projects">
    <ListItem entity="project">
      <Row height={72} gap={12}>
        <Image size={48} field="coverImage" />
        <Stack flex={1}>
          <Title field="name" />
          <Row>
            <Badge field="status" />
            <RelativeTime field="updatedAt" />
          </Row>
        </Stack>
        <MenuButton label="Project actions" />
      </Row>
    </ListItem>
  </List>
</Page>
```

The tree says that the projects appear as a vertical list, what each row communicates, which controls are exposed, and enough optional geometry to approximate the observed wireframe. Removing the geometry props is valid: primitive definitions supply inferred dimensions and layout behavior.

## What belongs here

- concrete UI patterns such as lists, cards, search inputs, tabs, and dialogs
- parent-child hierarchy and grouping
- spatial relationships such as row, stack, split, alignment, ordering, and scrolling
- optional reconstructive geometry such as fill/content sizing, dimensions, gaps, padding, flex weights, grid spans, and positioning
- information hierarchy and data references
- actions, destinations, interaction affordances, and visible UI state

## What does not

- colors, fonts, shadows, borders, radii, materials, or CSS
- styling tokens, CSS units or formulas, decorative transforms, or framework breakpoints
- framework components, hooks, event objects, or rendering logic
- domain components such as `Project`, `Event`, or `Seller`
- a visual design system or a deterministic renderer

## Uses

- extract a semantic structure from an existing app or screenshot
- compare two UIs independently of visual styling
- critique or transform information and interaction design
- communicate redesign intent before choosing a visual system or framework
- provide structured input to later implementation work

See [SPEC.md](SPEC.md) for the normative v0.1 language, [docs/spatial-geometry.md](docs/spatial-geometry.md) for the geometry grammar, [docs/canonicalization.md](docs/canonicalization.md) for authoring choices, and [examples](examples) for stress tests.

## Wireframe viewer

The repository includes an interactive reference viewer that parses the restricted JSX and renders it through executable React primitive definitions. Each primitive owns an intrinsic size profile. Optional geometry props override the relevant inferred values; omitted geometry continues to use the existing primitive defaults.

```sh
bun install
bun run dev
```

The viewer supports live editing, local `.jsx` files, bundled examples, multiple canvas widths, primitive anatomy labels, and alternate state regions. See [docs/wireframe-viewer.md](docs/wireframe-viewer.md) for the rendering model and limitations.

Run the complete formatting, Oxlint, test, and production-build checks with:

```sh
bun run check
```

Oxlint runs type-aware TypeScript, React, JSX accessibility, and Vitest correctness rules. The semantic JSX files in `examples/` are exercised by the parser tests instead of linted as executable React modules. Use `bun run lint:fix` to apply Oxlint's safe fixes.

## Status

**Experimental v0.1.** The vocabulary and rules are usable for discussion and annotation, but unresolved issues are deliberately recorded rather than hidden. The included parser and wireframe viewer are reference tooling; there is no public package or compatibility guarantee yet.

The name **UI AST** emphasizes that the output is a structural representation. “Layer 2” names the boundary, not a product tier or version.

## Prior work

UI AST is informed by W3C model-based UI work, the Cameleon Reference Framework, the W3C Abstract User Interface model, UIML, the Open UI Community Group, and the OpenUI specification. Those efforts provide useful language for abstraction and common controls. Many older model-based systems emphasize producing deterministic platform UIs from one abstract model. UI AST instead emphasizes the reverse and divergent path: existing UI → semantic concrete representation → design reasoning and transformation → potentially many redesigned outputs. See [docs/related-work.md](docs/related-work.md).

## Repository map

- `SPEC.md` — normative v0.1 rules
- `primitives/` — primitive reference by category
- `docs/` — principles, spatial geometry, canonicalization, prior work, and open questions
- `examples/` — realistic `.jsx` fixtures used to challenge the vocabulary
- `src/` — the interactive wireframe viewer and executable primitive registry

## License

[MIT](LICENSE)
