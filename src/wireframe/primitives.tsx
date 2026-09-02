import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

import type {
  IntrinsicSize,
  PrimitiveCategory,
  PrimitiveDefinition,
  PrimitiveProps,
} from "./types";
import { ViewerContext } from "./context";
import { geometryStyle } from "./geometry";

const SIZE = {
  page: {
    profile: "page",
    inline: "fill",
    block: "region",
    minInline: 320,
    minBlock: 520,
  },
  region: {
    profile: "region",
    inline: "fill",
    block: "content",
    minInline: 180,
    minBlock: 48,
  },
  layout: {
    profile: "layout",
    inline: "fill",
    block: "content",
    minInline: 80,
    minBlock: 24,
  },
  text: {
    profile: "text-line",
    inline: "content",
    block: "line",
    minInline: 32,
    minBlock: 18,
  },
  title: {
    profile: "title-line",
    inline: "content",
    block: "line",
    minInline: 72,
    minBlock: 24,
  },
  icon: {
    profile: "icon",
    inline: "compact",
    block: "line",
    minInline: 20,
    minBlock: 20,
    aspectRatio: "1 / 1",
  },
  avatar: {
    profile: "avatar",
    inline: "compact",
    block: "media",
    minInline: 32,
    minBlock: 32,
    aspectRatio: "1 / 1",
  },
  media: {
    profile: "media",
    inline: "content",
    block: "media",
    minInline: 112,
    minBlock: 76,
    compactMinInline: 64,
    compactMinBlock: 48,
    aspectRatio: "4 / 3",
  },
  badge: {
    profile: "badge",
    inline: "compact",
    block: "line",
    minInline: 42,
    minBlock: 22,
  },
  control: {
    profile: "control",
    inline: "content",
    block: "control",
    minInline: 88,
    minBlock: 38,
  },
  iconControl: {
    profile: "icon-control",
    inline: "compact",
    block: "control",
    minInline: 38,
    minBlock: 38,
    aspectRatio: "1 / 1",
  },
  input: {
    profile: "input",
    inline: "fill",
    block: "control",
    minInline: 160,
    minBlock: 40,
  },
  collection: {
    profile: "collection",
    inline: "fill",
    block: "content",
    minInline: 220,
    minBlock: 104,
  },
  overlay: {
    profile: "overlay",
    inline: "fill",
    block: "region",
    minInline: 260,
    minBlock: 120,
  },
  complex: {
    profile: "complex",
    inline: "fill",
    block: "region",
    minInline: 280,
    minBlock: 180,
  },
  state: {
    profile: "state",
    inline: "fill",
    block: "region",
    minInline: 220,
    minBlock: 92,
  },
  form: {
    profile: "form",
    inline: "fill",
    block: "content",
    minInline: 220,
    minBlock: 64,
  },
} as const satisfies Record<string, IntrinsicSize>;

type WireframeStyle = CSSProperties & Record<`--wf-${string}`, string>;

function stringProp(props: PrimitiveProps, name: string): string | undefined {
  const value = props[name];
  return typeof value === "string" ? value : undefined;
}

function numberProp(props: PrimitiveProps, name: string): number | undefined {
  const value = props[name];
  return typeof value === "number" ? value : undefined;
}

function booleanProp(props: PrimitiveProps, name: string): boolean {
  return props[name] === true;
}

function humanize(value: string): string {
  const leaf = value.split(".").at(-1) ?? value;
  return leaf
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function binding(value: string): ReactNode {
  return <span className="wf-binding">{`{${value}}`}</span>;
}

function contentOf(props: PrimitiveProps, fallback: string): ReactNode {
  if (Children.count(props.children) > 0) return props.children;

  const field = stringProp(props, "field");
  if (field) return binding(field);

  const value = props.value;
  if (typeof value === "string" || typeof value === "number") return value;

  const label = stringProp(props, "label");
  return label ?? fallback;
}

function sourceCaption(props: PrimitiveProps): string | undefined {
  const source = stringProp(props, "source");
  return source ? `source: ${source}` : undefined;
}

const GLYPHS: Readonly<Record<string, string>> = Object.freeze({
  plus: "+",
  notifications: "◌",
  "chevron-right": "›",
  clock: "◷",
  location: "⌖",
  home: "⌂",
  discover: "⌕",
  chat: "◫",
  email: "@",
  phone: "⌕",
  menu: "⋯",
  search: "⌕",
  filter: "▽",
  calendar: "□",
  item: "◇",
});

function Glyph({ name = "item" }: { name?: string }) {
  return (
    <span className="wf-glyph" aria-hidden="true">
      {GLYPHS[name] ?? name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function PrimitiveFrame({
  name,
  category,
  size,
  props,
  className = "",
  style,
  children,
  caption,
}: {
  name: string;
  category: PrimitiveCategory;
  size: IntrinsicSize;
  props: PrimitiveProps;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  caption?: string;
}) {
  const frameStyle: WireframeStyle = {
    ...style,
    ...(size.minInline ? { "--wf-min-inline": `${size.minInline}px` } : {}),
    ...(size.minBlock ? { "--wf-min-block": `${size.minBlock}px` } : {}),
    ...(size.compactMinInline
      ? { "--wf-compact-min-inline": `${size.compactMinInline}px` }
      : {}),
    ...(size.compactMinBlock
      ? { "--wf-compact-min-block": `${size.compactMinBlock}px` }
      : {}),
    ...(size.aspectRatio ? { "--wf-aspect": size.aspectRatio } : {}),
    ...geometryStyle(props),
  };

  const id = stringProp(props, "id");

  return (
    <div
      id={id}
      className={`wf-node wf-${name.toLowerCase()} ${className}`.trim()}
      data-primitive={name}
      data-category={category}
      data-inline={size.inline}
      data-block={size.block}
      data-size-profile={size.profile}
      data-edge={stringProp(props, "edge")}
      data-position={stringProp(props, "position")}
      data-scroll={stringProp(props, "scroll")}
      style={frameStyle}
    >
      <span className="wf-node-tag" aria-hidden="true">
        {name}
        <span>{size.profile}</span>
      </span>
      {caption ? <span className="wf-source-tag">{caption}</span> : null}
      {children}
    </div>
  );
}

type BodyRenderer = (props: PrimitiveProps) => ReactNode;
type StyleResolver = (props: PrimitiveProps) => CSSProperties | undefined;

function define(
  name: string,
  category: PrimitiveCategory,
  size: IntrinsicSize,
  className: string,
  body: BodyRenderer = (props) => props.children,
  style?: StyleResolver,
): PrimitiveDefinition {
  function PrimitiveComponent(props: PrimitiveProps) {
    return (
      <PrimitiveFrame
        name={name}
        category={category}
        size={size}
        props={props}
        className={className}
        style={style?.(props)}
        caption={sourceCaption(props)}
      >
        {body(props)}
      </PrimitiveFrame>
    );
  }

  PrimitiveComponent.displayName = `Wireframe${name}`;
  return { name, category, size, Component: PrimitiveComponent };
}

const ALIGN: Record<string, CSSProperties["alignItems"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  baseline: "baseline",
  stretch: "stretch",
};

const JUSTIFY: Record<string, CSSProperties["justifyContent"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

function flowStyle(props: PrimitiveProps): CSSProperties {
  const align = stringProp(props, "align");
  const justify = stringProp(props, "justify");
  return {
    ...(align ? { alignItems: ALIGN[align] } : {}),
    ...(justify ? { justifyContent: JUSTIFY[justify] } : {}),
  };
}

function rowStyle(props: PrimitiveProps): CSSProperties {
  return {
    alignItems: "center",
    ...flowStyle(props),
  };
}

function repeatChildren(children: ReactNode, count: number): ReactNode[] {
  const nodes = Children.toArray(children);
  const repeated: ReactNode[] = [];

  for (let repeat = 0; repeat < count; repeat += 1) {
    nodes.forEach((child, index) => {
      if (isValidElement(child)) {
        repeated.push(
          cloneElement(child, { key: `repeat-${repeat}-${index}` }),
        );
      } else {
        repeated.push(child);
      }
    });
  }

  return repeated;
}

function fieldVisual(props: PrimitiveProps, fallback: string): ReactNode {
  const field = stringProp(props, "field");
  return field ? binding(field) : contentOf(props, fallback);
}

function textDefinition(
  name: string,
  className: string,
  size: IntrinsicSize = SIZE.text,
): PrimitiveDefinition {
  return define(name, "display", size, className, (props) =>
    contentOf(props, name),
  );
}

const structureDefinitions = [
  define("Page", "structure", SIZE.page, "wf-page"),
  define("ScrollPage", "structure", SIZE.page, "wf-page wf-scroll-page"),
  define("Section", "structure", SIZE.region, "wf-section"),
  define("Panel", "structure", SIZE.region, "wf-panel"),
  define("Header", "structure", SIZE.region, "wf-header"),
  define("Footer", "structure", SIZE.region, "wf-footer"),
];

const layoutDefinitions = [
  define("Row", "layout", SIZE.layout, "wf-row", undefined, rowStyle),
  define("Stack", "layout", SIZE.layout, "wf-stack", undefined, flowStyle),
  define("Grid", "layout", SIZE.layout, "wf-grid", undefined, (props) => ({
    gridTemplateColumns: `repeat(${numberProp(props, "columns") ?? 2}, minmax(0, 1fr))`,
  })),
  define("Split", "layout", SIZE.layout, "wf-split", undefined, (props) => ({
    gridTemplateColumns:
      stringProp(props, "primary") === "first"
        ? "minmax(0, 1.65fr) minmax(0, 1fr)"
        : "minmax(0, 1fr) minmax(0, 1.65fr)",
  })),
  define("Sidebar", "layout", SIZE.region, "wf-sidebar"),
  define("Spacer", "layout", SIZE.layout, "wf-spacer", () => null),
];

const displayDefinitions = [
  textDefinition("Text", "wf-text"),
  define("Title", "display", SIZE.title, "wf-title", (props) =>
    contentOf(props, "Untitled"),
  ),
  textDefinition("Description", "wf-text wf-description"),
  textDefinition("Metadata", "wf-text wf-metadata"),
  define("Image", "display", SIZE.media, "wf-image", (props) => (
    <>
      <svg viewBox="0 0 120 76" aria-hidden="true">
        <path d="M1 75 34 39l19 18 19-27 47 45" />
        <circle cx="91" cy="20" r="7" />
      </svg>
      <span>{fieldVisual(props, "Image")}</span>
    </>
  )),
  define("Avatar", "display", SIZE.avatar, "wf-avatar", (props) => {
    const label =
      stringProp(props, "label") ??
      stringProp(props, "field") ??
      stringProp(props, "source") ??
      "Avatar";
    return <span aria-label={label}>{humanize(label).slice(0, 1)}</span>;
  }),
  define("Icon", "display", SIZE.icon, "wf-icon", (props) => (
    <Glyph name={stringProp(props, "icon")} />
  )),
  define("BrandMark", "display", SIZE.title, "wf-brand-mark", (props) => (
    <>
      <span className="wf-brand-symbol" aria-hidden="true" />
      <span>{stringProp(props, "name") ?? "Brand"}</span>
    </>
  )),
  textDefinition("Badge", "wf-badge", SIZE.badge),
  textDefinition("Metric", "wf-metric", SIZE.title),
  define("Progress", "display", SIZE.region, "wf-progress", (props) => (
    <>
      <span>{contentOf(props, "Progress")}</span>
      <span className="wf-progress-track" aria-hidden="true">
        <span />
      </span>
    </>
  )),
  textDefinition("Code", "wf-code", SIZE.region),
  textDefinition("Date", "wf-date"),
  textDefinition("RelativeTime", "wf-relative-time"),
  define("IconText", "display", SIZE.text, "wf-icon-text", (props) => (
    <>
      <Glyph name={stringProp(props, "icon")} />
      <span>{fieldVisual(props, "Value")}</span>
    </>
  )),
];

function buttonBody(props: PrimitiveProps, fallback: string): ReactNode {
  return (
    <button
      type="button"
      disabled={booleanProp(props, "disabled")}
      aria-label={stringProp(props, "label")}
    >
      {contentOf(props, fallback)}
    </button>
  );
}

const actionDefinitions = [
  define("Button", "action", SIZE.control, "wf-button", (props) =>
    buttonBody(props, "Button"),
  ),
  define(
    "IconButton",
    "action",
    SIZE.iconControl,
    "wf-icon-button",
    (props) => (
      <button
        type="button"
        disabled={booleanProp(props, "disabled")}
        aria-label={stringProp(props, "label") ?? "Icon action"}
        title={stringProp(props, "label")}
      >
        <Glyph name={stringProp(props, "icon")} />
        {stringProp(props, "badge") ? (
          <span className="wf-button-badge" />
        ) : null}
      </button>
    ),
  ),
  define("Link", "action", SIZE.text, "wf-link", (props) => (
    <a
      href={`#${stringProp(props, "destination") ?? "destination"}`}
      aria-current={booleanProp(props, "selected") ? "page" : undefined}
    >
      {contentOf(props, "Link")}
    </a>
  )),
  define(
    "MenuButton",
    "action",
    SIZE.iconControl,
    "wf-menu-button",
    (props) => (
      <button type="button" aria-label={stringProp(props, "label") ?? "Menu"}>
        <Glyph name={stringProp(props, "icon") ?? "menu"} />
      </button>
    ),
  ),
];

function inputLabel(props: PrimitiveProps, fallback: string): string {
  return (
    stringProp(props, "label") ??
    stringProp(props, "placeholder") ??
    stringProp(props, "name") ??
    fallback
  );
}

const inputDefinitions = [
  define("TextInput", "input", SIZE.input, "wf-input", (props) => (
    <input
      aria-label={inputLabel(props, "Text input")}
      placeholder={
        stringProp(props, "placeholder") ?? inputLabel(props, "Text input")
      }
      readOnly
    />
  )),
  define(
    "SearchInput",
    "input",
    SIZE.input,
    "wf-input wf-search-input",
    (props) => (
      <label>
        <Glyph name="search" />
        <input
          aria-label={inputLabel(props, "Search")}
          placeholder={stringProp(props, "placeholder") ?? "Search"}
          readOnly
        />
      </label>
    ),
  ),
  define("TextArea", "input", SIZE.input, "wf-input wf-text-area", (props) => (
    <textarea
      aria-label={inputLabel(props, "Text area")}
      placeholder={
        stringProp(props, "placeholder") ?? inputLabel(props, "Text area")
      }
      readOnly
    />
  )),
  define("Checkbox", "input", SIZE.control, "wf-check-control", (props) => (
    <label>
      <input type="checkbox" checked={booleanProp(props, "checked")} readOnly />
      <span>{inputLabel(props, "Checkbox")}</span>
    </label>
  )),
  define("RadioGroup", "input", SIZE.region, "wf-radio-group", (props) => (
    <fieldset>
      <legend>{inputLabel(props, "Options")}</legend>
      {["Option A", "Option B", "Option C"].map((option, index) => (
        <label key={option}>
          <input
            type="radio"
            name={stringProp(props, "name") ?? "wireframe-options"}
            checked={index === 0}
            readOnly
          />
          {option}
        </label>
      ))}
    </fieldset>
  )),
  define("Switch", "input", SIZE.control, "wf-switch", (props) => (
    <button
      type="button"
      role="switch"
      aria-checked={
        booleanProp(props, "checked") || typeof props.checked === "string"
      }
      aria-label={inputLabel(props, "Switch")}
    >
      <span />
    </button>
  )),
  define("Select", "input", SIZE.control, "wf-select", (props) => (
    <button type="button" aria-label={inputLabel(props, "Select")}>
      <span>{contentOf(props, inputLabel(props, "Select"))}</span>
      <span aria-hidden="true">⌄</span>
    </button>
  )),
  define("MultiSelect", "input", SIZE.input, "wf-select", (props) => (
    <button type="button" aria-label={inputLabel(props, "Multi-select")}>
      <span>{contentOf(props, inputLabel(props, "Choose options"))}</span>
      <span aria-hidden="true">⌄</span>
    </button>
  )),
  define("DatePicker", "input", SIZE.input, "wf-select", (props) => (
    <button type="button" aria-label={inputLabel(props, "Choose date")}>
      <span>{contentOf(props, inputLabel(props, "Choose date"))}</span>
      <Glyph name="calendar" />
    </button>
  )),
];

function compactControl(
  props: PrimitiveProps,
  fallback: string,
  glyph?: string,
): ReactNode {
  return (
    <button type="button" aria-label={inputLabel(props, fallback)}>
      {glyph ? <Glyph name={glyph} /> : null}
      <span>{contentOf(props, inputLabel(props, fallback))}</span>
      <span aria-hidden="true">⌄</span>
    </button>
  );
}

const queryDefinitions = [
  define("FilterBar", "query", SIZE.region, "wf-filter-bar"),
  define("FilterButton", "query", SIZE.control, "wf-compact-control", (props) =>
    compactControl(props, "Filters", "filter"),
  ),
  define("SelectFilter", "query", SIZE.control, "wf-compact-control", (props) =>
    compactControl(props, "Filter"),
  ),
  define(
    "MultiSelectFilter",
    "query",
    SIZE.control,
    "wf-compact-control",
    (props) => compactControl(props, "Filters"),
  ),
  define(
    "SearchButton",
    "query",
    SIZE.iconControl,
    "wf-icon-button",
    (props) => (
      <button type="button" aria-label={inputLabel(props, "Search")}>
        <Glyph name="search" />
      </button>
    ),
  ),
  define("SortButton", "query", SIZE.control, "wf-compact-control", (props) =>
    compactControl(props, "Sort", "sort"),
  ),
  define("SortSelect", "query", SIZE.control, "wf-compact-control", (props) =>
    compactControl(props, "Sort"),
  ),
];

const navigationDefinitions = [
  define("Tabs", "navigation", SIZE.region, "wf-tabs"),
  define("Tab", "navigation", SIZE.control, "wf-tab", (props) => (
    <button
      type="button"
      role="tab"
      aria-selected={booleanProp(props, "selected")}
      data-selected={booleanProp(props, "selected") || undefined}
    >
      {stringProp(props, "icon") ? (
        <Glyph name={stringProp(props, "icon")} />
      ) : null}
      <span>{contentOf(props, "Tab")}</span>
    </button>
  )),
  define(
    "Breadcrumbs",
    "navigation",
    SIZE.region,
    "wf-breadcrumbs",
    (props) => {
      const childCount = Children.count(props.children);
      return Children.map(props.children, (child, index) => (
        <span>
          {child}
          {index < childCount - 1 ? <span aria-hidden="true">/</span> : null}
        </span>
      ));
    },
  ),
  define("Pagination", "navigation", SIZE.region, "wf-pagination", () => (
    <>
      <button type="button" aria-label="Previous page">
        ‹
      </button>
      <button type="button" aria-current="page">
        1
      </button>
      <button type="button">2</button>
      <button type="button">3</button>
      <button type="button" aria-label="Next page">
        ›
      </button>
    </>
  )),
  define("SidebarNav", "navigation", SIZE.region, "wf-sidebar-nav"),
  define("TopNav", "navigation", SIZE.region, "wf-top-nav"),
  define(
    "Stepper",
    "navigation",
    SIZE.region,
    "wf-stepper",
    (props) =>
      props.children ?? (
        <>
          {["Details", "Review", "Complete"].map((label, index) => (
            <span key={label} data-current={index === 0 || undefined}>
              <span>{index + 1}</span>
              {label}
            </span>
          ))}
        </>
      ),
  ),
  define("BottomTabBar", "navigation", SIZE.region, "wf-bottom-tabs"),
];

function collectionDefinition(
  name: string,
  className: string,
  count: number,
): PrimitiveDefinition {
  return define(name, "collection", SIZE.collection, className, (props) =>
    repeatChildren(props.children, count),
  );
}

function tableColumns(
  props: PrimitiveProps,
): Array<ReactElement<PrimitiveProps>> {
  return Children.toArray(props.children).filter(
    (child): child is ReactElement<PrimitiveProps> => isValidElement(child),
  );
}

function tableGrid(columns: Array<ReactElement<PrimitiveProps>>): string {
  return columns
    .map((column) => {
      const kind = stringProp(column.props, "kind");
      if (kind === "selection") return "40px";
      if (kind === "actions") return "64px";
      return "minmax(110px, 1fr)";
    })
    .join(" ");
}

const dataTableDefinition = define(
  "DataTable",
  "collection",
  SIZE.collection,
  "wf-data-table",
  (props) => {
    const columns = tableColumns(props);
    const gridTemplateColumns = tableGrid(columns);

    return (
      <div className="wf-table-scroll">
        <div className="wf-table-head" style={{ gridTemplateColumns }}>
          {columns.map((column, index) => (
            <span key={index}>
              {stringProp(column.props, "kind") === "selection"
                ? "□"
                : (stringProp(column.props, "label") ?? "Column")}
              {stringProp(column.props, "sortBy") ? (
                <span aria-hidden="true"> ↕</span>
              ) : null}
            </span>
          ))}
        </div>
        {[0, 1, 2].map((row) => (
          <div
            className="wf-table-row"
            style={{ gridTemplateColumns }}
            key={row}
          >
            {columns.map((column, columnIndex) => {
              const kind = stringProp(column.props, "kind");
              let cell: ReactNode = column.props.children;

              if (kind === "selection") {
                cell = <span className="wf-table-check">□</span>;
              } else if (Children.count(cell) === 0) {
                const field = stringProp(column.props, "field");
                cell = field ? binding(field) : "—";
              }

              return <div key={columnIndex}>{cell}</div>;
            })}
          </div>
        ))}
      </div>
    );
  },
);

const collectionDefinitions = [
  collectionDefinition("List", "wf-list", 3),
  collectionDefinition("HorizontalList", "wf-horizontal-list", 3),
  define("ListItem", "collection", SIZE.region, "wf-list-item"),
  collectionDefinition("GridList", "wf-grid-list", 4),
  define("Card", "collection", SIZE.region, "wf-card"),
  dataTableDefinition,
  define(
    "TableColumn",
    "collection",
    SIZE.region,
    "wf-table-column",
    (props) => props.children ?? fieldVisual(props, "Column"),
  ),
  collectionDefinition("Tree", "wf-tree", 3),
  define("TreeItem", "collection", SIZE.region, "wf-tree-item", (props) => (
    <>
      <span aria-hidden="true">
        {booleanProp(props, "expanded") ? "⌄" : "›"}
      </span>
      {contentOf(props, "Tree item")}
    </>
  )),
  collectionDefinition("Feed", "wf-feed", 3),
  collectionDefinition("GroupedList", "wf-grouped-list", 2),
  define("Group", "collection", SIZE.collection, "wf-group"),
];

const overlayDefinitions = [
  define("Menu", "overlay", SIZE.overlay, "wf-menu"),
  define("MenuItem", "overlay", SIZE.control, "wf-menu-item", (props) =>
    buttonBody(props, "Menu item"),
  ),
  define("ContextMenu", "overlay", SIZE.overlay, "wf-menu"),
  define("Popover", "overlay", SIZE.overlay, "wf-popover"),
  define("Tooltip", "overlay", SIZE.text, "wf-tooltip", (props) =>
    contentOf(props, "Tooltip"),
  ),
  define("Dialog", "overlay", SIZE.overlay, "wf-dialog"),
  define("Drawer", "overlay", SIZE.overlay, "wf-drawer"),
  define("Accordion", "overlay", SIZE.region, "wf-accordion"),
];

function generatedComplexBody(name: string, props: PrimitiveProps): ReactNode {
  if (Children.count(props.children) > 0) return props.children;

  if (name === "Timeline") {
    return ["Created account", "Joined workspace", "Updated profile"].map(
      (item, index) => (
        <div className="wf-timeline-item" key={item}>
          <span />
          <div>
            <strong>{item}</strong>
            <small>{index + 1} days ago</small>
          </div>
        </div>
      ),
    );
  }

  if (name === "Calendar" || name === "Schedule") {
    return (
      <div className="wf-calendar-grid">
        {Array.from({ length: 28 }, (_, index) => (
          <span key={index}>{index + 1}</span>
        ))}
      </div>
    );
  }

  if (name === "Kanban") {
    return (
      <div className="wf-kanban-grid">
        {["Backlog", "In progress", "Done"].map((column) => (
          <div key={column}>
            <strong>{column}</strong>
            <span />
            <span />
          </div>
        ))}
      </div>
    );
  }

  if (name === "Chart") {
    return (
      <div
        className="wf-chart-bars"
        aria-label={stringProp(props, "label") ?? "Chart"}
      >
        {[38, 66, 48, 82, 58, 74].map((height, index) => (
          <span key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
    );
  }

  return null;
}

const complexDefinitions = [
  "Timeline",
  "Calendar",
  "Schedule",
  "Kanban",
  "Chart",
].map((name) =>
  define(
    name,
    "complex",
    SIZE.complex,
    `wf-complex wf-${name.toLowerCase()}`,
    (props) => generatedComplexBody(name, props),
  ),
);

function stateDefinition(name: string, className: string): PrimitiveDefinition {
  function StatePrimitive(props: PrimitiveProps) {
    const preferences = useContext(ViewerContext);
    const when = stringProp(props, "when");
    if (when && !preferences.showStateVariants) return null;

    return (
      <PrimitiveFrame
        name={name}
        category="state"
        size={SIZE.state}
        props={props}
        className={`wf-state ${className}`}
        caption={when ? `when: ${when}` : undefined}
      >
        {Children.count(props.children) > 0 ? (
          props.children
        ) : (
          <>
            <span className="wf-state-symbol" aria-hidden="true" />
            <span>{stringProp(props, "label") ?? humanize(name)}</span>
          </>
        )}
      </PrimitiveFrame>
    );
  }

  StatePrimitive.displayName = `Wireframe${name}`;
  return {
    name,
    category: "state",
    size: SIZE.state,
    Component: StatePrimitive,
  };
}

const stateDefinitions = [
  stateDefinition("EmptyState", "wf-empty-state"),
  stateDefinition("LoadingState", "wf-loading-state"),
  stateDefinition("ErrorState", "wf-error-state"),
  stateDefinition("Alert", "wf-alert"),
  stateDefinition("Toast", "wf-toast"),
  stateDefinition("Confirmation", "wf-confirmation"),
];

const formDefinitions = [
  define("Form", "form", SIZE.form, "wf-form"),
  define("FormField", "form", SIZE.form, "wf-form-field", (props) => (
    <>
      <span className="wf-field-label">
        {stringProp(props, "label") ?? "Field"}
        {booleanProp(props, "required") ? (
          <span aria-hidden="true"> *</span>
        ) : null}
      </span>
      {props.children}
    </>
  )),
  define("FieldGroup", "form", SIZE.form, "wf-field-group", (props) => (
    <>
      <span className="wf-group-label">
        {stringProp(props, "label") ?? "Group"}
      </span>
      <div>{props.children}</div>
    </>
  )),
];

const allDefinitions = [
  ...structureDefinitions,
  ...layoutDefinitions,
  ...displayDefinitions,
  ...actionDefinitions,
  ...inputDefinitions,
  ...queryDefinitions,
  ...navigationDefinitions,
  ...collectionDefinitions,
  ...overlayDefinitions,
  ...complexDefinitions,
  ...stateDefinitions,
  ...formDefinitions,
];

export const primitiveDefinitions: Readonly<
  Record<string, PrimitiveDefinition>
> = Object.freeze(
  Object.fromEntries(
    allDefinitions.map((definition) => [definition.name, definition]),
  ),
);

export const primitiveCount = allDefinitions.length;
