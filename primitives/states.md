# State and feedback primitives

State-region primitives represent meaningful visible alternatives or feedback. Inline states such as `selected`, `checked`, `expanded`, `disabled`, `busy`, and `invalid` remain props on the node that manifests them.

| Primitive      | Semantics                                               | Notable props and children                                              |
| -------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| `EmptyState`   | Region replacing absent collection or content           | `when`, optional `label`; explanation and actions                       |
| `LoadingState` | Region-level loading representation                     | `when`, optional `label`                                                |
| `ErrorState`   | Region-level failure representation                     | `when`, optional `label`; explanation and recovery actions              |
| `Alert`        | Persistent contextual feedback or warning               | `kind` is `info`, `success`, `warning`, or `error`; content and actions |
| `Toast`        | Transient non-modal feedback                            | `kind`, `when`; content and optional action                             |
| `Confirmation` | State requiring explicit confirmation before proceeding | `when`, `label`; explanation and actions                                |

`kind` communicates feedback meaning, not color. Use `Confirmation` for the decision state, often inside a `Dialog`; use `Dialog` alone when no confirmation semantics are present.

State regions MAY appear beside normal content to document mutually exclusive observable variants. v0.1 does not execute `when` or define state-transition logic.
