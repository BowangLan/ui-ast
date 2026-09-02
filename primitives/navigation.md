# Navigation primitives

Navigation primitives expose movement among views, regions, or steps.

| Primitive      | Semantics                                                   | Notable props and children                                      |
| -------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| `Tabs`         | Mutually exclusive peer views                               | `id`; `Tab` children                                            |
| `Tab`          | One peer-view destination                                   | `label`, optional `icon`, `destination`, `selected`, `controls` |
| `Breadcrumbs`  | Hierarchical path to the current view                       | ordered `Link` children and current `Text`                      |
| `Pagination`   | Movement through discrete result pages                      | `source`, optional `value`, `action`, `controls`                |
| `SidebarNav`   | Persistent edge navigation among destinations               | `id`, optional `label`; links or navigation groups              |
| `TopNav`       | Persistent top navigation among destinations                | `id`; links and actions                                         |
| `Stepper`      | Ordered multi-step workflow navigation and progress         | `source`; step destinations, current `value`                    |
| `BottomTabBar` | Persistent bottom navigation among primary app destinations | `id`; `Tab` children                                            |

Use `Tabs` for peer content views and `BottomTabBar` for primary application navigation even though both contain `Tab`. Use `Stepper` only when order and progress through a workflow matter.

Source order is navigation order. Visual placement details, mobile safe areas, sticky positioning, and transition animation are Layer 3 or implementation concerns.
