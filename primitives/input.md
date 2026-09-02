# Input primitives

Input primitives collect or select user-provided values.

| Primitive     | Semantics                                                   | Notable props                                                       |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `TextInput`   | Single-line free text                                       | `name`, `field`, `placeholder`, `required`, state props             |
| `SearchInput` | Text input whose value queries visible or navigable content | `name`, `placeholder`, `action`, `controls`, state props            |
| `TextArea`    | Multi-line free text                                        | `name`, `field`, `placeholder`, `required`, state props             |
| `Checkbox`    | Independent binary selection                                | `name`, `field`, `label`, `checked`, optional `action`, state props |
| `RadioGroup`  | One selection from a visibly enumerated set                 | `name`, `field`, `label`, `options`, state props                    |
| `Switch`      | Immediate on/off setting                                    | `name`, `field`, `label`, `checked`, optional `action`, state props |
| `Select`      | Compact single selection from choices                       | `name`, `field`, `value`, `label`, `options`, `action`, state props |
| `MultiSelect` | Compact multiple selection from choices                     | `name`, `field`, `label`, `options`, `action`, state props          |
| `DatePicker`  | Date or date-range selection                                | `name`, `field`, `label`, `action`, state props                     |

State props include `disabled`, `busy`, and `invalid`; selection controls also use `checked` where defined. `required` is a semantic input constraint, not a visual marker.

Use `SearchInput`, not `TextInput role="search"`. Use `Switch` for an immediately applied setting and `Checkbox` for an independent selection or a value commonly submitted with a form. Exact option-child anatomy is unresolved; `options` references an option set in v0.1.
