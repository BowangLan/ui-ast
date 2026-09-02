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

  it("centers Row children by default and respects explicit alignment", () => {
    expect(render("<Row><Text>Default</Text></Row>")).toContain(
      "align-items:center",
    );
    expect(render('<Row align="end"><Text>End</Text></Row>')).toContain(
      "align-items:flex-end",
    );
  });

  it("uses optional geometry to override primitive inference", () => {
    const markup = render(`
      <Row width="fill" gap={12} paddingX={16} wrap>
        <Stack flex={1} minWidth={0}>
          <Text width="fill" lines={2}>Summary</Text>
        </Stack>
        <IconButton size={44} icon="filter" label="Filters" />
      </Row>
    `);

    expect(markup).toContain("width:100%");
    expect(markup).toContain("gap:12px");
    expect(markup).toContain("padding-left:16px");
    expect(markup).toContain("padding-right:16px");
    expect(markup).toContain("flex-wrap:wrap");
    expect(markup).toContain("flex:1 1 0px");
    expect(markup).toContain("--wf-lines:2");
    expect(markup).toContain("width:44px;height:44px");
    expect(markup).toContain("min-width:0;min-height:0");
  });

  it("retains inferred geometry when optional props are omitted", () => {
    const markup = render('<IconButton icon="filter" label="Filters" />');

    expect(markup).toContain("--wf-min-inline:38px");
    expect(markup).toContain("--wf-aspect:1 / 1");
    expect(markup).not.toContain("width:44px");
  });

  it("renders grid, scrolling, sticky, and floating geometry", () => {
    const markup = render(`
      <Page>
        <Header position="sticky" top={0} height={64} />
        <Grid columns={12} gap={16}>
          <Panel columnSpan={4} height={400} scroll="vertical" />
          <IconButton id="menu-trigger" icon="menu" label="Menu" />
          <Menu
            position="floating"
            anchor="menu-trigger"
            placement="bottom-end"
            width={220}
          />
        </Grid>
      </Page>
    `);

    expect(markup).toContain("position:sticky");
    expect(markup).toContain("top:0px");
    expect(markup).toContain(
      "grid-template-columns:repeat(12, minmax(0, 1fr))",
    );
    expect(markup).toContain("grid-column:span 4");
    expect(markup).toContain("overflow-y:auto");
    expect(markup).toContain("anchor-name:--wf-menu-trigger");
    expect(markup).toContain("position-anchor:--wf-menu-trigger");
    expect(markup).toContain("position-area:bottom right");
  });

  it("supports fixed placement, clipped overflow, and signed offsets", () => {
    const markup = render(`
      <Page>
        <Panel overflow="clip" />
        <Dialog
          position="fixed"
          placement="center"
          top={-8}
          width={480}
          maxHeight={640}
        />
      </Page>
    `);

    expect(markup).toContain("overflow:clip");
    expect(markup).toContain("position:fixed");
    expect(markup).toContain("top:-8px");
    expect(markup).toContain("left:50%");
    expect(markup).toContain("transform:translate(-50%, -50%)");
  });

  it("rejects non-canonical geometry values", () => {
    expect(() => render('<Panel width="320px" />')).toThrow(
      'width must be a non-negative number, "fill", or "content"',
    );
    expect(() => render("<Row gap={-4} />")).toThrow(
      "gap must be a finite non-negative number",
    );
    expect(() => render('<Menu position="floating" />')).toThrow(
      'anchor is required when position="floating"',
    );
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
