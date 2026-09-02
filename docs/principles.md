# Design principles

## Preserve UI form

A representation should retain enough concrete form that a reader can picture the interface's structure and interaction method. `SearchInput` is concrete; `Search` is only a capability. `ListItem entity="event"` is concrete UI form plus domain context; `Event` is only domain context.

Every node should principally answer at least one question:

1. What concrete UI pattern is this?
2. How are these pieces spatially composed?
3. What information does this element communicate?
4. What interaction does it expose?

## Separate the three layers

Layer 1 identifies information and domain concepts. Layer 2 gives that information a UI form. Layer 3 gives the form a visual treatment. A useful tree may reference Layer 1 through `source`, `field`, and `entity`, but its node names remain Layer 2 concepts.

```jsx
<List source="orders">
  <ListItem entity="order">
    <Row>
      <Text field="customer.name" />
      <Badge field="status" />
    </Row>
  </ListItem>
</List>
```

The tree does not restate the order schema, and it does not choose a color for the badge.

## Describe significance, not pixels

Qualitative layout is semantic when it affects reading order, grouping, comparison, or discoverability. `Row`, `Stack`, `justify="between"`, and `Sidebar position="left"` belong in Layer 2. `gap={12}`, `padding={16}`, and `width={280}` do not.

Likewise, action emphasis can affect the user's choices, so `emphasis="primary"` is allowed. A button's blue fill is not.

## Prefer composition

Add a primitive when a stable industry UI concept carries structure or interaction semantics that composition cannot express clearly. Do not add a primitive as shorthand for a recurring domain object.

```jsx
<Row align="center">
  <Avatar field="author.avatar" />
  <Text field="author.name" />
</Row>
```

is preferable to `<Author />`.

## Optimize for comparable descriptions

Two authors describing the same interface should tend toward similar trees. Canonical primitives and prop forms reduce equivalent spellings. The goal is useful convergence, not lossless screenshots or mathematically unique serialization.

## Keep uncertainty visible

The specification should state unresolved distinctions as open questions. Examples are test fixtures: if an interface is awkward to encode, that is evidence about the language rather than a reason to hide detail in a custom component.
