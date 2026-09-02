# Related work

UI AST is not the first attempt to represent interfaces above implementation code. Its scope is narrower and its optimization target differs from several predecessors.

## W3C model-based UI and Cameleon

The W3C [Introduction to Model-Based User Interfaces](https://www.w3.org/TR/mbui-intro/) describes the Cameleon Reference Framework's levels from task and domain models through abstract, concrete, and final UIs. That separation is useful context for UI AST's three-layer boundary. UI AST concentrates on a semantic, concrete UI description and does not currently specify task models, transformations, or final rendering.

## W3C Abstract User Interface model

The W3C [Abstract User Interface Models draft](https://www.w3.org/2011/mbui/drafts/abstract-ui/) defines a metamodel and serialization independent of platform and interaction modality. UI AST shares its interest in implementation independence, but intentionally retains concrete patterns such as tabs, data tables, icon buttons, and drawers when those patterns matter to reasoning about an existing interface.

## UIML

The OASIS [User Interface Markup Language 4.0](https://www.oasis-open.org/standard/uiml-v4-0/) provides a device-independent XML representation designed for mapping to existing languages. Its interface model includes structure, style, content, and behavior. UI AST deliberately excludes style and toolkit mappings. JSX is used only as readable tree notation in v0.1, not as a commitment to React or JavaScript execution.

## Open UI Community Group and OpenUI

The [Open UI Community Group](https://www.w3.org/groups/cg/open-ui/) researches components and controls across design systems, frameworks, and the web platform. Its [specification process](https://open-ui.org/working-mode/) standardizes names, anatomies, and behaviors for common controls. That work is relevant when deciding whether a primitive is established and which semantics it carries. UI AST has a broader screen-structure vocabulary and a different deliverable: descriptions for analysis and transformation rather than browser-standard component implementations.

## Different optimization target

Many model-based UI systems are commonly framed as:

> one abstract UI → deterministic rendering across platforms

UI AST is framed as:

> existing UI → semantic concrete UI representation → design reasoning or transformation → potentially many redesigned outputs

Accordingly, v0.1 favors faithful, comparable descriptions of observed UI form. It does not promise enough constraints to reconstruct the original pixels or generate one canonical implementation.

This document acknowledges conceptual relationships; it is not yet a comprehensive literature review. Exact semantic mappings remain future research.
