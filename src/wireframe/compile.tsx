import { parse } from "@babel/parser";
import { createElement, type ReactNode } from "react";

import { validateGeometryProps } from "./geometry";
import type { PrimitiveDefinition, PrimitiveProps } from "./types";

interface SourceLocation {
  line: number;
  column: number;
}

interface JsxIdentifier {
  type: "JSXIdentifier";
  name: string;
  loc?: { start: SourceLocation };
}

interface StringLiteral {
  type: "StringLiteral";
  value: string;
  loc?: { start: SourceLocation };
}

interface NumericLiteral {
  type: "NumericLiteral";
  value: number;
  loc?: { start: SourceLocation };
}

interface BooleanLiteral {
  type: "BooleanLiteral";
  value: boolean;
  loc?: { start: SourceLocation };
}

interface NullLiteral {
  type: "NullLiteral";
  loc?: { start: SourceLocation };
}

interface UnaryNumericLiteral {
  type: "UnaryExpression";
  operator: "-";
  argument: NumericLiteral;
  loc?: { start: SourceLocation };
}

interface JsxEmptyExpression {
  type: "JSXEmptyExpression";
  loc?: { start: SourceLocation };
}

interface JsxExpressionContainer {
  type: "JSXExpressionContainer";
  expression:
    | StringLiteral
    | NumericLiteral
    | BooleanLiteral
    | NullLiteral
    | UnaryNumericLiteral
    | JsxEmptyExpression
    | { type: string; loc?: { start: SourceLocation } };
  loc?: { start: SourceLocation };
}

interface JsxText {
  type: "JSXText";
  value: string;
}

interface JsxAttribute {
  type: "JSXAttribute";
  name: JsxIdentifier;
  value: StringLiteral | JsxExpressionContainer | null;
  loc?: { start: SourceLocation };
}

interface JsxSpreadAttribute {
  type: "JSXSpreadAttribute";
  loc?: { start: SourceLocation };
}

interface JsxElement {
  type: "JSXElement";
  openingElement: {
    name: JsxIdentifier | { type: string; loc?: { start: SourceLocation } };
    attributes: Array<JsxAttribute | JsxSpreadAttribute>;
  };
  children: Array<JsxElement | JsxText | JsxExpressionContainer>;
  loc?: { start: SourceLocation };
}

function locationSuffix(node: { loc?: { start: SourceLocation } }): string {
  if (!node.loc) return "";
  return ` at ${node.loc.start.line}:${node.loc.start.column + 1}`;
}

function normalizeJsxText(value: string): string | null {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : null;
}

function expressionValue(container: JsxExpressionContainer): unknown {
  const expression = container.expression;

  switch (expression.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return (expression as StringLiteral | NumericLiteral | BooleanLiteral)
        .value;
    case "NullLiteral":
      return null;
    case "UnaryExpression": {
      const unary = expression as UnaryNumericLiteral;
      if (unary.operator === "-" && unary.argument.type === "NumericLiteral") {
        return -unary.argument.value;
      }
      throw new Error(
        `Only literal JSX expressions are allowed${locationSuffix(expression)}`,
      );
    }
    case "JSXEmptyExpression":
      return undefined;
    default:
      throw new Error(
        `Only literal JSX expressions are allowed${locationSuffix(expression)}`,
      );
  }
}

function attributesToProps(
  attributes: Array<JsxAttribute | JsxSpreadAttribute>,
): PrimitiveProps {
  const props: PrimitiveProps = {};

  for (const attribute of attributes) {
    if (attribute.type === "JSXSpreadAttribute") {
      throw new Error(
        `Spread attributes are not allowed${locationSuffix(attribute)}`,
      );
    }

    if (attribute.name.type !== "JSXIdentifier") {
      throw new Error(
        `Only plain prop names are allowed${locationSuffix(attribute)}`,
      );
    }

    const attributeName = attribute.name.name;
    if (attribute.value === null) {
      props[attributeName] = true;
      continue;
    }

    if (attribute.value.type === "StringLiteral") {
      props[attributeName] = attribute.value.value;
      continue;
    }

    const value = expressionValue(attribute.value);
    if (value !== undefined) props[attributeName] = value;
  }

  return props;
}

function elementToReact(
  node: JsxElement,
  definitions: Readonly<Record<string, PrimitiveDefinition>>,
  key: string,
): ReactNode {
  const tag = node.openingElement.name;
  if (tag.type !== "JSXIdentifier") {
    throw new Error(
      `Only plain primitive names are allowed${locationSuffix(tag)}`,
    );
  }

  const tagName = (tag as JsxIdentifier).name;
  const definition = definitions[tagName];
  if (!definition) {
    throw new Error(
      `Unknown primitive <${tagName}>${locationSuffix(node)}. Add it to the primitive registry before rendering it.`,
    );
  }

  const props = attributesToProps(node.openingElement.attributes);
  validateGeometryProps(tagName, props);
  const children: ReactNode[] = [];

  node.children.forEach((child, index) => {
    if (child.type === "JSXElement") {
      children.push(elementToReact(child, definitions, `${key}.${index}`));
      return;
    }

    if (child.type === "JSXText") {
      const text = normalizeJsxText(child.value);
      if (text) children.push(text);
      return;
    }

    const value = expressionValue(child);
    if (typeof value === "string" || typeof value === "number") {
      children.push(value);
    }
  });

  return createElement(
    definition.Component,
    { ...props, key },
    children.length > 0 ? children : undefined,
  );
}

export function compileLayer2Jsx(
  source: string,
  definitions: Readonly<Record<string, PrimitiveDefinition>>,
): ReactNode {
  if (source.trim().length === 0) {
    throw new Error("Enter a UI AST JSX tree to render it.");
  }

  const file = parse(source, {
    plugins: ["jsx"],
    sourceType: "module",
  });

  if (file.program.body.length !== 1) {
    throw new Error("The document must contain exactly one JSX expression.");
  }

  const statement = file.program.body[0];
  if (statement.type !== "ExpressionStatement") {
    throw new Error(
      "The document may not contain imports, declarations, or code.",
    );
  }

  const expression = statement.expression;

  if (expression.type !== "JSXElement") {
    throw new Error("The document root must be a UI AST JSX element.");
  }

  return elementToReact(
    expression as unknown as JsxElement,
    definitions,
    "root",
  );
}
