# Open questions from v0.1 stress tests

These questions came from encoding a mobile event feed, settings page, desktop data table, and master-detail interface. They are not silently resolved by the examples.

## 1. Responsive composition

The master-detail example uses `Split`, but many real interfaces collapse the detail pane into navigation on narrow screens. Encoding both without pixels, breakpoints, framework syntax, or duplicate trees needs a semantic variant model.

**v0.1 decision:** describe the dominant observed state and add a comment when a materially different composition is known. Do not add breakpoint props.

## 2. Selection scope in master-detail UIs

`List selection="single"` and `ListItem selected="selection.customer"` communicate the observed interaction, but v0.1 does not say how an item binds its identity into the selection state or the detail source.

**Open Question:** should there be a small reference syntax for current-entity identity and action/destination parameters, or would that turn the AST into a dataflow language?

## 3. Data-table anatomy

A data table needs columns, sorting, row selection, and row actions. Generic layout composition loses column alignment; a fully expanded `TableHeader`/`TableRow`/`TableCell` tree becomes repetitive and resembles HTML.

**v0.1 decision:** use `TableColumn` declarations under `DataTable` and allow an actions column. Cell-template and custom-renderer semantics remain undefined.

**Open Question:** what canonical interchange grammar should preserve a composed cell such as avatar plus name without turning column templates into implementation code?

## 4. Fixed versus data-driven options

Settings expose radio and select options that may be fixed product choices rather than records. `options="themeOptions"` is compact but hides visible option labels; repeated option children are explicit but no option primitive has yet earned standard status.

**Open Question:** standardize `Option`, use literal children, or treat options as Layer 1 data only?

## 5. Form fields and settings rows

A settings page often presents a label, explanation, and trailing switch as a recognizable settings row. `FormField` composition can express it, but may falsely imply submission-oriented form behavior.

**v0.1 decision:** keep the composition and do not add `Setting` or `SettingsItem` yet. Seek examples from permissions, notification preferences, and device settings.

## 6. Feed versus list

The event example is sectioned and recommendation-oriented but not necessarily an infinite activity feed. `List` is structurally sufficient; `Feed` should carry continuing, ordered-consumption semantics rather than act as a fashionable synonym.

**v0.1 decision:** the Luma-like screen uses `List` and `GroupedList`, not `Feed`.

## 7. Group headers and template scopes

`GroupedList` needs a `Group` template whose heading reads group-level fields while its nested `ListItem` reads item-level fields. The current definition states these scopes informally.

**Open Question:** define separate `groupField` and `field`, implicit nested scopes, or explicit scope aliases?

## 8. Alternative and transient state

Sibling `LoadingState`, `EmptyState`, and content nodes document variants well for human readers but do not define mutual exclusion. Toasts and dialogs may be conditional yet overlay otherwise stable content.

**Open Question:** is opaque `when` sufficient for analysis, or is an explicit `StateGroup` useful without becoming a rendering language?

## 9. Card and panel boundaries

The event list does not require `Card`; adding it merely because an implementation has rounded backgrounds would leak Layer 3 styling. Yet cards can be a real grouping and activation pattern.

**Open Question:** what observable non-visual criteria distinguish a card from a list item or panel—independent activation, self-contained actions, portability, or something else?

## 10. Disclosure and action ownership

In the master-detail example, the detail header owns actions while selection happens in the list. The AST describes both but does not express which region refreshes after each action.

**Open Question:** should `controls` cover mutation effects as well as disclosure, or should action effects remain outside Layer 2?

## 11. Accessibility semantics

`label` is required for icon-only controls, and many semantics are inherent in primitive choice. Complex descriptions, error association, live-region behavior, table header scope, and keyboard interaction are not modeled.

**Open Question:** which accessibility relationships materially belong to the interaction model without copying ARIA or platform APIs?

## 12. Calendar, kanban, chart, and other complex primitives

These names preserve important concrete form, but their useful internal anatomy is not specified. Treating them as opaque loses information; fully modeling them could rapidly expand the language.

**v0.1 decision:** retain them provisionally with narrow definitions and require ordinary primitives for visible surrounding controls, legends, and actions. Use examples to decide future anatomy.

## 13. Single-record data scope

Forms and detail panes often describe one record without a collection item to establish the current entity. The settings and master-detail examples currently use document-global paths such as `currentUser.name` and `selectedCustomer.name`.

**Open Question:** should a domain-neutral structure node be able to establish an entity source, or should global data paths remain an authoring convention? A new `Entity` primitive would risk confusing Layer 1 data structure with Layer 2 UI form.
