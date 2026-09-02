# UI AST specification v0.1

Status: **experimental draft**

This document defines the normative core of UI AST v0.1. Primitive reference files are normative where this document links to them. Examples and explanatory documents are informative, except where a rule explicitly says otherwise.

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as requirement levels.

## 1. Scope

UI AST describes an observed or intended user interface at the level of concrete UI structure and interaction. It records:

- visible structural regions and their hierarchy;
- qualitative spatial composition and semantic order;
- established display, input, navigation, collection, and overlay patterns;
- the information communicated by elements;
- the actions and destinations exposed to a user; and
- UI state that materially affects what the user perceives or can do.

UI AST does not define visual styling, application data schemas, business logic, platform widgets, rendering algorithms, or framework code. A conforming document need not be sufficient to reproduce an interface deterministically.

## 2. Terminology

**Document** — one UI AST tree describing a screen, view, or independently meaningful UI fragment.

**Node** — a named primitive, a set of props, and ordered zero or more children.

**Primitive** — a domain-neutral Layer 2 UI concept such as `Row`, `SearchInput`, or `DataTable`.

**Prop** — a named semantic attribute of a node.

**Region** — a structural node that groups a meaningful part of the UI.

**Current entity** — the record established by the nearest enclosing entity scope, normally a collection item.

**Data reference** — an opaque stable path into a data or state model. It is descriptive, not executable.

**Action reference** — an opaque stable name for a command exposed by the interface.

**Destination reference** — an opaque stable name for a navigation target.

**Snapshot state** — a literal state observed in the represented UI, such as a selected tab.

## 3. Representation and document model

### 3.1 JSX is notation

v0.1 uses a restricted JSX-like syntax because it makes ordered trees legible. A UI AST document MUST be treated as declarative data. JSX usage does not imply React, JavaScript execution, DOM elements, imports, components, hooks, or event handlers.

A document MUST have exactly one root node. A full screen SHOULD use `Page` as its root. A fragment MAY use the narrowest meaningful structural or interactive root.

### 3.2 Node model

Conceptually, each node contains:

```text
Node {
  type: PrimitiveName
  props: Map<String, ScalarOrReference>
  children: OrderedList<NodeOrLiteralText>
}
```

Child order MUST express semantic reading, focus, or traversal order. Layout props MUST NOT be used to reverse an incorrectly ordered tree.

Literal text children MAY be used only where the text is visible UI content. Comments MAY explain an encoding decision but are not part of the UI AST.

Arbitrary JavaScript expressions, object construction, spreading, callbacks, and control flow MUST NOT appear. Numeric and boolean JSX literals, such as `columns={3}` and `selected`, are allowed. Arrays SHOULD be avoided; use child nodes or a named source instead.

### 3.3 Identity

`id` assigns stable identity within a document. Authors SHOULD add it only when another node references the node, when multiple states of the same region must be compared, or when stable annotation identity is useful. IDs MUST describe interface identity, not generated DOM identity.

## 4. Primitive design and naming

A standard primitive MUST:

1. name a recognizable UI pattern, spatial composition, information role, or interaction affordance;
2. be independent of a product's domain model;
3. add semantics that are not already clear from a small composition of standard primitives; and
4. avoid committing to a visual style or implementation mechanism.

Primitive names use singular `PascalCase`, except established collective concepts such as `Tabs` and `Breadcrumbs`. Interactive names SHOULD identify their manifestation: `SearchInput`, `FilterButton`, and `MultiSelectFilter` are valid; `Search`, `Filter`, and `Choose` are not.

Domain names MUST NOT be node types. Use `ListItem entity="event"`, not `Event`; compose `Avatar` and `Text`, not `Organizer`.

The standard vocabulary is defined in [primitives](primitives). A primitive's omission is intentional until examples demonstrate a stable need.

## 5. Prop model

### 5.1 Allowed categories

A prop is allowed only when its value materially affects information hierarchy, spatial hierarchy, grouping, discoverability, interaction method, user flow, accessible meaning, or visible UI state.

| Category         | Standard props                                                           | Purpose                                           |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------- |
| Identity         | `id`                                                                     | Stable document-local identity                    |
| Data             | `source`, `field`, `entity`, `value`, `groupBy`                          | Bind collections or displayed values              |
| Interaction      | `action`, `destination`, `label`, `controls`                             | Name commands, navigation, and controlled regions |
| Layout           | `align`, `justify`, `columns`, `position`, `primary`                     | Qualitative spatial composition                   |
| Hierarchy        | `level`, `kind`, `emphasis`                                              | Information or decision importance                |
| State            | `selected`, `checked`, `expanded`, `disabled`, `busy`, `invalid`, `when` | Snapshot or referenced visible state              |
| Input            | `name`, `placeholder`, `required`, `multiple`, `options`                 | User-entered or selected information              |
| Pattern-specific | `icon`, `badge`, `sortBy`, `selection`, and primitive-defined props      | Semantics unique to a concrete pattern            |

The table is not permission to place every prop on every primitive. Each primitive reference defines meaningful props. Unlisted props require the extension process in section 13.

`emphasis="primary|secondary|danger"` is allowed only on actions. It expresses decision hierarchy or destructive consequence, not color or styling.

### 5.2 Forbidden styling information

Documents MUST NOT contain props or nodes whose purpose is to encode:

- color, opacity, gradient, texture, or background treatment;
- font family, font size, font weight, line height, or letter spacing;
- borders, strokes, corner radii, or shadows;
- exact gap, margin, padding, inset, coordinates, width, height, or aspect ratio;
- responsive breakpoints or device-specific pixel values;
- class names, CSS, style objects, design tokens, or theme identifiers;
- animation duration, easing, or other visual motion treatment; or
- implementation-framework, component-library, or DOM details.

An exact count MAY be used when it changes composition rather than styling: `Grid columns={3}`, a pagination page, or a progress value is valid. Intrinsic media semantics such as image alternative text are also valid.

`Spacer` is valid only for a meaningful flexible separation in composition. It MUST NOT carry a size.

## 6. Composition rules

- Structure nodes establish meaningful regions; layout nodes arrange siblings; leaf nodes display information or expose interaction.
- Authors SHOULD use the fewest nodes that preserve meaningful UI form.
- Authors MUST NOT insert wrappers solely to mirror DOM structure, implementation components, or visual spacing.
- A node MAY combine a concrete pattern with children when that pattern conventionally has anatomy: `Dialog`, `Card`, `Menu`, and `ListItem` are examples.
- Interactive nodes MUST NOT be nested when doing so would produce competing activation semantics. For example, a `Link` MUST NOT contain a `Button`.
- Repeated UI MUST use an appropriate collection node rather than copying sample instances, unless the instances are semantically fixed navigation or form choices.
- A visible, meaningful element SHOULD appear in the tree even if its data is unknown. Unknown visual decoration SHOULD be omitted.

## 7. Data and information

### 7.1 Data sources

`source` names a data reference. On collections and option-bearing controls it names a collection or option set, such as `projects` or `filters.statusOptions`. On media nodes it MAY name a document-global media reference, such as `currentUser.avatar`. It MUST be an opaque dotted path, not a query, URL, array literal, asset filename, or executable expression.

A collection node establishes an item scope for its repeated item child. That child SHOULD declare a singular `entity` name:

```jsx
<List source="projects">
  <ListItem entity="project">…</ListItem>
</List>
```

`entity` supplies domain context; it does not define a schema or fetch data. A nested collection establishes a new current entity until that collection ends.

`DataTable` is the v0.1 exception to the explicit item-child rule. It MUST declare `entity`, which establishes the row scope shared by its `TableColumn` templates.

### 7.2 Fields and literal values

`field` is a dotted path resolved relative to the current entity, unless the path is explicitly document-global by project convention. It identifies communicated or edited information; it MUST NOT contain formatting or computation instructions.

`value` represents a literal semantic value shown or held by a control. Literal visible copy SHOULD usually be a text child. A node MUST NOT provide the same content through `field`, `value`, and a text child simultaneously.

Formatting categories that affect meaning MAY use concrete primitives (`Date`, `RelativeTime`, `Progress`) rather than format strings. Locale and display formatting are outside v0.1.

### 7.3 Options and grouping

`options` names an option-set reference for selection controls. Fixed choices MAY instead be represented as appropriate children, such as `RadioGroup` containing labeled controls when a future option-child grammar is defined. This is an open area in v0.1.

`groupBy` names the field used to partition a `GroupedList`. It does not encode a sorting or aggregation expression.

## 8. Actions and navigation

`action` names a user command using a stable lower-kebab-case identifier, such as `create-event`. It describes intent, not a handler, API endpoint, gesture recognizer, or function call.

`destination` names a navigation target using a stable identifier such as `event-details`. A destination MAY be parameterized by the current entity by convention, but v0.1 does not define parameter syntax.

Use `action` when activation changes data or UI state without primarily navigating. Use `destination` when activation primarily navigates. A node MAY carry both only when the observed control genuinely performs both and the ambiguity is documented.

Controls without visible text, especially `IconButton`, MUST have `label`. The label states user-facing purpose. `icon` names semantic icon content, not an icon file or library symbol.

The AST records exposed interaction, not event plumbing. Props such as `onClick`, `onChange`, `href`, and callback expressions are forbidden.

## 9. State

Standard inline state props are `selected`, `checked`, `expanded`, `disabled`, `busy`, and `invalid`.

- A boolean value records snapshot state: `<Tab selected … />`.
- A string value names an opaque state reference: `<Switch checked="notifications.enabled" … />`.
- State props MUST NOT contain predicates or executable expressions.

`when` names the state reference under which a state-region is visible. It SHOULD be used on `LoadingState`, `EmptyState`, `ErrorState`, `Confirmation`, or another whole-region alternative, not as a general conditional-rendering language.

```jsx
<List source="projects">…</List>
<EmptyState when="projects.empty">…</EmptyState>
<LoadingState when="projects.loading" />
```

State nodes MAY appear beside their normal-content region to document alternatives even though only one is visible at runtime. This is a specification of observable variants, not an execution rule.

State that does not change the perceived interface or available interaction SHOULD be omitted. Business workflow state belongs in Layer 1 unless manifested through a Layer 2 element such as a `Badge`, disabled action, or progress indicator.

## 10. Layout semantics

Layout encodes qualitative relationships, never measurement.

- `Row` composes children along a horizontal reading axis.
- `Stack` composes children along a vertical reading axis.
- `Grid` places repeated or comparable items in two-dimensional tracks. `columns` is a positive integer only when the observed track count is meaningful.
- `Split` creates two peer regions. `primary="first|second"` MAY identify the region with greater information or interaction priority.
- `Sidebar` identifies a secondary edge region; `position="left|right"` records its relationship to primary content.
- `Spacer` consumes otherwise available space to separate meaningful groups. It has no sizing props.

`align="start|center|end|baseline|stretch"` describes the cross-axis relationship. `Row` defaults to `align="center"` when the prop is omitted. `justify="start|center|end|between|around|evenly"` describes main-axis distribution. Authors SHOULD omit default or visually uncertain values.

Layout nodes do not imply CSS flexbox or grid. Responsive alternatives are not standardized in v0.1; document the dominant observed composition and note meaningful variants when necessary.

### 10.1 Renderer intrinsic sizing

A renderer MAY associate intrinsic size metadata with each primitive definition. Such metadata can distinguish fill, content-sized, compact, line, control, media, and region behavior. It MAY include renderer-specific minimums or aspect ratios needed to produce a useful preview.

Intrinsic sizing metadata MUST NOT be serialized as document props. In particular, renderer minimums do not make `width`, `height`, `gap`, or other Layer 3 measurements valid UI AST. Different renderers MAY choose different pixels while preserving the primitive's qualitative size behavior.

The repository's executable registry is a non-normative reference implementation of this rule.

## 11. Collections and scopes

`List`, `HorizontalList`, `GridList`, `DataTable`, `Tree`, `Feed`, and `GroupedList` express distinct observed collection forms. Authors MUST choose based on the interaction and visual organization, not the underlying data type.

- `List`, `HorizontalList`, and `GridList` SHOULD contain one item template.
- `ListItem` is the default item template for lists and feeds.
- `Card` MAY be the item template for a card collection when self-contained card anatomy is material.
- `DataTable` declares a row `entity` and uses `TableColumn` children to declare visible columns. A `TableColumn` MAY contain a display or action template resolved in that row scope.
- `GroupedList` contains one `Group` template. `Group` contains a visible group heading and one nested collection.
- `Tree` represents hierarchical disclosure and SHOULD use `TreeItem`; recursive template semantics remain open.

`Feed` is reserved for a chronologically or algorithmically ordered stream whose continuing consumption behavior matters. Otherwise use `List`.

## 12. Canonicalization and conformance

A conforming v0.1 document:

1. obeys the restricted node and prop model;
2. uses only standard v0.1 primitives or clearly marked extensions;
3. contains no forbidden Layer 3 or implementation information;
4. follows the canonical choice rules in [docs/canonicalization.md](docs/canonicalization.md); and
5. records known non-standard or ambiguous choices near the document or in project notes.

Canonical choices include:

- `SearchInput`, not `TextInput role="search"`;
- `IconButton` for an icon-only button;
- `Row` and `Stack` for horizontal and vertical composition;
- `ListItem entity="event"`, not a domain node named `Event`;
- `Title level="section"`, not `SectionTitle`;
- explicit controls such as `SelectFilter`, not capabilities such as `Filter`; and
- composition instead of domain-specific summary primitives.

Canonicalization aims for structural similarity, not byte-for-byte equality. Attribute order and insignificant whitespace have no meaning in v0.1.

## 13. Extension strategy

Extensions are evidence-gathering tools, not a shortcut around the standard vocabulary.

Before adding one, an author SHOULD attempt standard composition and SHOULD verify that the proposed concept is a recognizable cross-domain UI pattern. An experimental primitive MUST use an `X` prefix, such as `XMap`, and its first use MUST be accompanied by a short semantic definition. Experimental props use an `x-` prefix where the notation permits it.

A proposal for standardization SHOULD include:

- at least two cross-domain examples;
- why composition is insufficient or materially less comparable;
- allowed children and semantic props;
- canonicalization against adjacent primitives; and
- an explanation of the Layer 2 versus Layer 3 boundary.

Standard primitives MAY be deprecated only with a documented canonical replacement. v0.1 defines no compatibility mechanism or registry.

## 14. Primitive index

- [Structure](primitives/structure.md)
- [Layout](primitives/layout.md)
- [Display](primitives/display.md)
- [Actions](primitives/actions.md)
- [Input](primitives/input.md)
- [Filtering and querying](primitives/querying.md)
- [Navigation](primitives/navigation.md)
- [Collections](primitives/collections.md)
- [Overlays and disclosure](primitives/overlays.md)
- [Complex UI](primitives/complex.md)
- [State and feedback](primitives/states.md)
- [Forms](primitives/forms.md)

## 15. Open questions

The following are explicitly unresolved in v0.1:

- a machine-readable schema and interchange form beyond restricted JSX;
- a canonical grammar for fixed options, table cells, tree recursion, and slot-like anatomy;
- data-reference scoping, global references, joins, and destination parameters;
- responsive or modality-specific variants without introducing Layer 3 breakpoints;
- whether `Description` and `Metadata` justify separate primitives from `Text kind`;
- when `Card`, `Panel`, and plain structural composition are observably distinct;
- how to represent drag-and-drop, direct manipulation, and spatial canvases;
- how much accessibility semantics must be explicit versus inherent in primitives; and
- how canonical similarity should eventually be measured.

Stress-test findings and further questions are tracked in [docs/open-questions.md](docs/open-questions.md).
