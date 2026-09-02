import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { samples } from "../samples";
import { compileLayer2Jsx } from "./compile";
import { primitiveDefinitions } from "./primitives";
import { WireframeProvider } from "./provider";

function render(source: string): string {
  const tree = compileLayer2Jsx(source, primitiveDefinitions);
  return renderToStaticMarkup(
    <WireframeProvider
      preferences={{ showAnatomy: true, showStateVariants: false }}
    >
      {tree}
    </WireframeProvider>,
  );
}

describe("compileLayer2Jsx", () => {
  it("renders restricted JSX through the primitive components", () => {
    const markup = render(`
      <Page id="projects">
        <Row justify="between">
          <Title level="page">Projects</Title>
          <Button action="create-project">Create project</Button>
        </Row>
      </Page>
    `);

    expect(markup).toContain('data-primitive="Page"');
    expect(markup).toContain('data-primitive="Row"');
    expect(markup).toContain("Projects");
    expect(markup).toContain("Create project");
  });

  it.each(samples)("compiles the $label example", ({ source }) => {
    expect(() => render(source)).not.toThrow();
  });

  it.each(Object.keys(primitiveDefinitions))(
    "renders the <%s> primitive definition",
    (name) => {
      expect(() => render(`<${name} />`)).not.toThrow();
    },
  );

  it("rejects unknown primitives", () => {
    expect(() => render("<Project />")).toThrow("Unknown primitive <Project>");
  });

  it("rejects executable JSX expressions", () => {
    expect(() => render("<Grid columns={getColumns()} />")).toThrow(
      "Only literal JSX expressions are allowed",
    );
  });

  it("keeps intrinsic size metadata on every definition", () => {
    for (const definition of Object.values(primitiveDefinitions)) {
      expect(definition.size.profile).not.toBe("");
      expect(definition.size.inline).toMatch(/^(fill|content|compact)$/);
      expect(definition.size.block).toMatch(
        /^(content|line|control|media|region)$/,
      );
    }
  });
});
