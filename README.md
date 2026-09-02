# UI AST

UI AST is an experimental JSX vocabulary for describing the concrete structure and behavior of user interfaces without describing their visual styling or implementation.

It occupies **Layer 2** between a product's information model and its visual design:

1. **Layer 1 — information:** domain entities, data, and product concepts
2. **Layer 2 — UI form:** hierarchy, spatial composition, controls, affordances, and visible state
3. **Layer 3 — visual design:** color, typography, borders, shadows, exact dimensions, spacing, and styling tokens

Prose is often too ambiguous for structural UI work, while screenshots mix structure with visual treatment and application code mixes UI intent with framework details. UI AST is a small intermediate representation that preserves recognizable UI form while leaving implementation and visual design open.

```jsx
<Page id="projects">
  <Row justify="between" align="center">
    <Title level="page">Projects</Title>
    <SearchInput placeholder="Search projects" action="search-projects" />
  </Row>

  <List source="projects">
    <ListItem entity="project">
      <Row align="center">
        <Image field="coverImage" />
        <Stack>
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

The tree says that the projects appear as a vertical list, what each row communicates, and which controls are exposed. It does not say what a project row looks like in pixels.

## What belongs here

- concrete UI patterns such as lists, cards, search inputs, tabs, and dialogs
- parent-child hierarchy and grouping
- qualitative spatial relationships such as row, stack, split, alignment, and ordering
- information hierarchy and data references
- actions, destinations, interaction affordances, and visible UI state

## What does not

- colors, fonts, shadows, borders, radii, or CSS
- exact gaps, padding, widths, heights, or breakpoints
- framework components, hooks, event objects, or rendering logic
- domain components such as `Project`, `Event`, or `Seller`
- a visual design system or a deterministic renderer

## Uses

- extract a semantic structure from an existing app or screenshot
- compare two UIs independently of visual styling
- critique or transform information and interaction design
- communicate redesign intent before choosing a visual system or framework
- provide structured input to later implementation work

See [SPEC.md](SPEC.md) for the normative v0.1 language, [docs/canonicalization.md](docs/canonicalization.md) for authoring choices, and [examples](examples) for stress tests.

## Wireframe viewer

The repository includes an interactive reference viewer that parses the restricted JSX and renders it through executable React primitive definitions. Each primitive owns an intrinsic size profile, so the viewer can infer control, media, collection, and region dimensions without adding visual props to the AST.

```sh
npm install
npm run dev
```

The viewer supports live editing, local `.jsx` files, bundled examples, multiple canvas widths, primitive anatomy labels, and alternate state regions. See [docs/wireframe-viewer.md](docs/wireframe-viewer.md) for the rendering model and limitations.

## Status

**Experimental v0.1.** The vocabulary and rules are usable for discussion and annotation, but unresolved issues are deliberately recorded rather than hidden. The included parser and wireframe viewer are reference tooling; there is no public package or compatibility guarantee yet.

The name **UI AST** emphasizes that the output is a structural representation. “Layer 2” names the boundary, not a product tier or version.

## Prior work

UI AST is informed by W3C model-based UI work, the Cameleon Reference Framework, the W3C Abstract User Interface model, UIML, the Open UI Community Group, and the OpenUI specification. Those efforts provide useful language for abstraction and common controls. Many older model-based systems emphasize producing deterministic platform UIs from one abstract model. UI AST instead emphasizes the reverse and divergent path: existing UI → semantic concrete representation → design reasoning and transformation → potentially many redesigned outputs. See [docs/related-work.md](docs/related-work.md).

## Repository map

- `SPEC.md` — normative v0.1 rules
- `primitives/` — primitive reference by category
- `docs/` — principles, canonicalization, prior work, and open questions
- `examples/` — realistic `.jsx` fixtures used to challenge the vocabulary
- `src/` — the interactive wireframe viewer and executable primitive registry

## License

[MIT](LICENSE)
