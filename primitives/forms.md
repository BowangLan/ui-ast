# Form primitives

Form primitives group inputs when submission, validation, or field relationships are material to the UI.

| Primitive    | Semantics                                                    | Notable props and children                                  |
| ------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| `Form`       | Related inputs participating in a submit or save interaction | `id`, `action`, `label`, state props; fields and actions    |
| `FormField`  | One labeled input with optional help or error information    | `label`, `required`, `invalid`; one primary input plus text |
| `FieldGroup` | Related fields perceived or validated together               | `label`; `FormField` or input children                      |

Prefer visible labels represented by `FormField label` over placeholder-only identification. A `FormField` may contain help text or an error `Alert` when those are visible and material.

Do not use `Form` merely because implementation code uses a form element. A search input that immediately filters a list and a switch that immediately changes a setting need not be wrapped in `Form`. Submission handlers, validation functions, schemas, and control-library components are outside the language.
