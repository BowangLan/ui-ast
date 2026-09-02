import type { CSSProperties } from "react";

import type { PrimitiveProps } from "./types";

type GeometryStyle = CSSProperties &
  Partial<Record<"anchorName" | "positionAnchor" | "positionArea", string>> &
  Record<`--wf-${string}`, string | number | undefined>;

const DIMENSION_PROPS = ["width", "height"] as const;
const NON_NEGATIVE_PROPS = [
  "size",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
  "gap",
  "rowGap",
  "columnGap",
  "padding",
  "paddingX",
  "paddingY",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "margin",
  "marginX",
  "marginY",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
] as const;
const OFFSET_PROPS = ["top", "right", "bottom", "left"] as const;
const INTEGER_PROPS = ["columns", "columnSpan", "rowSpan", "lines"] as const;

const ALIGN_VALUES = new Set(["start", "center", "end", "baseline", "stretch"]);
const JUSTIFY_VALUES = new Set([
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
]);
const POSITION_VALUES = new Set([
  "relative",
  "absolute",
  "sticky",
  "fixed",
  "floating",
]);
const SCROLL_VALUES = new Set(["vertical", "horizontal", "both"]);
const OVERFLOW_VALUES = new Set(["visible", "clip"]);
const PLACEMENT_VALUES = new Set([
  "top-start",
  "top",
  "top-end",
  "right-start",
  "right",
  "right-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
  "center",
]);

const ALIGN: Record<string, CSSProperties["alignItems"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  baseline: "baseline",
  stretch: "stretch",
};

const PLACEMENT_AREA: Record<string, string> = {
  "top-start": "top left",
  top: "top center",
  "top-end": "top right",
  "right-start": "right top",
  right: "right center",
  "right-end": "right bottom",
  "bottom-start": "bottom left",
  bottom: "bottom center",
  "bottom-end": "bottom right",
  "left-start": "left top",
  left: "left center",
  "left-end": "left bottom",
  center: "center",
};

const POSITION: Record<string, CSSProperties["position"]> = {
  relative: "relative",
  absolute: "absolute",
  sticky: "sticky",
  fixed: "fixed",
  floating: "absolute",
};

function hasProp(props: PrimitiveProps, name: string): boolean {
  return Object.hasOwn(props, name);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function px(value: unknown): string | undefined {
  return isFiniteNumber(value) ? `${value}px` : undefined;
}

function dimension(value: unknown, axis: "inline" | "block") {
  if (isFiniteNumber(value)) return `${value}px`;
  if (value === "fill") return "100%";
  if (value === "content") return axis === "inline" ? "fit-content" : "auto";
  return undefined;
}

function cssAnchorName(id: unknown): string | undefined {
  return typeof id === "string" && /^[a-z][a-z0-9-]*$/.test(id)
    ? `--wf-${id}`
    : undefined;
}

function fail(primitive: string, prop: string, expectation: string): never {
  throw new Error(`<${primitive}> geometry prop ${prop} ${expectation}.`);
}

function validateNonNegative(
  primitive: string,
  props: PrimitiveProps,
  name: string,
) {
  if (!hasProp(props, name)) return;
  const value = props[name];
  if (!isFiniteNumber(value) || value < 0) {
    fail(primitive, name, "must be a finite non-negative number");
  }
}

function validateEnum(
  primitive: string,
  props: PrimitiveProps,
  name: string,
  values: ReadonlySet<string>,
) {
  if (!hasProp(props, name)) return;
  const value = props[name];
  if (typeof value !== "string" || !values.has(value)) {
    fail(primitive, name, `must be one of: ${[...values].join(", ")}`);
  }
}

function validateAspectRatio(primitive: string, value: unknown) {
  if (isFiniteNumber(value) && value > 0) return;
  if (typeof value === "string") {
    const match = value.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
    if (match && Number(match[1]) > 0 && Number(match[2]) > 0) return;
  }
  fail(
    primitive,
    "aspectRatio",
    'must be a positive number or a ratio such as "16/9"',
  );
}

export function validateGeometryProps(
  primitive: string,
  props: PrimitiveProps,
): void {
  for (const name of DIMENSION_PROPS) {
    if (!hasProp(props, name)) continue;
    const value = props[name];
    if (
      (!isFiniteNumber(value) || value < 0) &&
      value !== "fill" &&
      value !== "content"
    ) {
      fail(
        primitive,
        name,
        'must be a non-negative number, "fill", or "content"',
      );
    }
  }

  for (const name of NON_NEGATIVE_PROPS) {
    validateNonNegative(primitive, props, name);
  }

  for (const name of OFFSET_PROPS) {
    if (hasProp(props, name) && !isFiniteNumber(props[name])) {
      fail(primitive, name, "must be a finite number");
    }
  }

  for (const name of INTEGER_PROPS) {
    if (
      hasProp(props, name) &&
      (!Number.isInteger(props[name]) || Number(props[name]) < 1)
    ) {
      fail(primitive, name, "must be a positive integer");
    }
  }

  if (hasProp(props, "flex")) {
    validateNonNegative(primitive, props, "flex");
  }
  if (hasProp(props, "wrap") && typeof props.wrap !== "boolean") {
    fail(primitive, "wrap", "must be a boolean");
  }
  if (hasProp(props, "aspectRatio")) {
    validateAspectRatio(primitive, props.aspectRatio);
  }

  validateEnum(primitive, props, "align", ALIGN_VALUES);
  validateEnum(primitive, props, "alignSelf", ALIGN_VALUES);
  validateEnum(primitive, props, "justify", JUSTIFY_VALUES);
  validateEnum(primitive, props, "position", POSITION_VALUES);
  validateEnum(primitive, props, "scroll", SCROLL_VALUES);
  validateEnum(primitive, props, "overflow", OVERFLOW_VALUES);
  validateEnum(primitive, props, "placement", PLACEMENT_VALUES);

  if (hasProp(props, "anchor")) {
    if (typeof props.anchor !== "string" || !cssAnchorName(props.anchor)) {
      fail(primitive, "anchor", "must reference a lower-kebab-case node id");
    }
  }
  if (props.position === "floating" && !hasProp(props, "anchor")) {
    fail(primitive, "anchor", 'is required when position="floating"');
  }
  if (
    hasProp(props, "placement") &&
    props.position !== "floating" &&
    props.position !== "fixed"
  ) {
    fail(primitive, "placement", 'requires position="floating" or "fixed"');
  }
  if (hasProp(props, "anchor") && props.position !== "floating") {
    fail(primitive, "anchor", 'requires position="floating"');
  }
  if (hasProp(props, "scroll") && hasProp(props, "overflow")) {
    fail(primitive, "overflow", "cannot be combined with scroll");
  }
}

export function geometryStyle(props: PrimitiveProps): GeometryStyle {
  const style: GeometryStyle = {};
  const size = px(props.size);
  if (size) {
    style.width = size;
    style.height = size;
    style.minWidth = 0;
    style.minHeight = 0;
  }

  const width = dimension(props.width, "inline");
  const height = dimension(props.height, "block");
  if (width) style.width = width;
  if (height) style.height = height;
  if (isFiniteNumber(props.width)) style.minWidth = 0;
  if (isFiniteNumber(props.height)) style.minHeight = 0;
  if (hasProp(props, "maxWidth") && !hasProp(props, "minWidth")) {
    style.minWidth = 0;
  }
  if (hasProp(props, "maxHeight") && !hasProp(props, "minHeight")) {
    style.minHeight = 0;
  }

  for (const [prop, cssProp] of [
    ["minWidth", "minWidth"],
    ["maxWidth", "maxWidth"],
    ["minHeight", "minHeight"],
    ["maxHeight", "maxHeight"],
    ["gap", "gap"],
    ["rowGap", "rowGap"],
    ["columnGap", "columnGap"],
    ["top", "top"],
    ["right", "right"],
    ["bottom", "bottom"],
    ["left", "left"],
  ] as const) {
    const value = px(props[prop]);
    if (value) style[cssProp] = value;
  }

  const paddingX = px(props.paddingX);
  const paddingY = px(props.paddingY);
  const marginX = px(props.marginX);
  const marginY = px(props.marginY);
  const padding = px(props.padding);
  const margin = px(props.margin);
  if (padding) style.padding = padding;
  if (margin) style.margin = margin;
  if (paddingX) {
    style.paddingLeft = paddingX;
    style.paddingRight = paddingX;
  }
  if (paddingY) {
    style.paddingTop = paddingY;
    style.paddingBottom = paddingY;
  }
  if (marginX) {
    style.marginLeft = marginX;
    style.marginRight = marginX;
  }
  if (marginY) {
    style.marginTop = marginY;
    style.marginBottom = marginY;
  }
  for (const [prop, cssProp] of [
    ["paddingTop", "paddingTop"],
    ["paddingRight", "paddingRight"],
    ["paddingBottom", "paddingBottom"],
    ["paddingLeft", "paddingLeft"],
    ["marginTop", "marginTop"],
    ["marginRight", "marginRight"],
    ["marginBottom", "marginBottom"],
    ["marginLeft", "marginLeft"],
  ] as const) {
    const value = px(props[prop]);
    if (value) style[cssProp] = value;
  }

  if (isFiniteNumber(props.flex)) {
    style.flex = props.flex === 0 ? "0 0 auto" : `${props.flex} 1 0px`;
    style.minWidth = style.minWidth ?? 0;
    style.minHeight = style.minHeight ?? 0;
  }
  if (typeof props.wrap === "boolean") {
    style.flexWrap = props.wrap ? "wrap" : "nowrap";
  }
  if (typeof props.alignSelf === "string") {
    style.alignSelf = ALIGN[props.alignSelf];
  }
  if (isPositiveInteger(props.columnSpan)) {
    style.gridColumn = `span ${props.columnSpan}`;
  }
  if (isPositiveInteger(props.rowSpan)) {
    style.gridRow = `span ${props.rowSpan}`;
  }
  if (
    typeof props.aspectRatio === "string" ||
    isFiniteNumber(props.aspectRatio)
  ) {
    style.aspectRatio = props.aspectRatio;
  }
  if (isPositiveInteger(props.lines)) {
    style["--wf-lines"] = props.lines;
  }

  const idAnchor = cssAnchorName(props.id);
  if (idAnchor) style.anchorName = idAnchor;

  if (typeof props.position === "string") {
    style.position = POSITION[props.position];
  }
  if (props.position === "floating") {
    const anchor = cssAnchorName(props.anchor);
    const placement =
      typeof props.placement === "string" ? props.placement : "bottom";
    if (anchor) style.positionAnchor = anchor;
    style.positionArea = PLACEMENT_AREA[placement];
  }

  if (props.position === "fixed" && typeof props.placement === "string") {
    const placement = props.placement;
    switch (placement) {
      case "top-start":
      case "left-start":
        style.top = style.top ?? 0;
        style.left = style.left ?? 0;
        break;
      case "top":
        style.top = style.top ?? 0;
        style.left = style.left ?? "50%";
        style.transform = "translateX(-50%)";
        break;
      case "top-end":
      case "right-start":
        style.top = style.top ?? 0;
        style.right = style.right ?? 0;
        break;
      case "right":
        style.top = style.top ?? "50%";
        style.right = style.right ?? 0;
        style.transform = "translateY(-50%)";
        break;
      case "right-end":
      case "bottom-end":
        style.right = style.right ?? 0;
        style.bottom = style.bottom ?? 0;
        break;
      case "bottom":
        style.bottom = style.bottom ?? 0;
        style.left = style.left ?? "50%";
        style.transform = "translateX(-50%)";
        break;
      case "bottom-start":
      case "left-end":
        style.bottom = style.bottom ?? 0;
        style.left = style.left ?? 0;
        break;
      case "left":
        style.top = style.top ?? "50%";
        style.left = style.left ?? 0;
        style.transform = "translateY(-50%)";
        break;
      case "center":
        style.top = style.top ?? "50%";
        style.left = style.left ?? "50%";
        style.transform = "translate(-50%, -50%)";
        break;
    }
  }

  switch (props.scroll) {
    case "vertical":
      style.overflowX = "hidden";
      style.overflowY = "auto";
      break;
    case "horizontal":
      style.overflowX = "auto";
      style.overflowY = "hidden";
      break;
    case "both":
      style.overflow = "auto";
      break;
  }
  if (props.overflow === "visible") style.overflow = "visible";
  if (props.overflow === "clip") style.overflow = "clip";

  return style;
}
