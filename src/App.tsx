import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";

import { samples, type SampleId } from "./samples";
import { primitiveCount, primitiveDefinitions } from "./wireframe/primitives";
import { WireframeProvider } from "./wireframe/provider";

type CanvasWidth = "fit" | "phone" | "tablet" | "desktop";
type Compiler = typeof import("./wireframe/compile").compileLayer2Jsx;
type SourceChoice = SampleId | "custom";

const CANVAS_WIDTHS: Record<CanvasWidth, string> = {
  fit: "min(100%, 1120px)",
  phone: "390px",
  tablet: "768px",
  desktop: "1120px",
};

const INITIAL_SAMPLE = samples[0];

interface CompileResult {
  tree: ReturnType<Compiler> | null;
  error: string | null;
}

function compile(source: string, compiler: Compiler): CompileResult {
  try {
    return {
      tree: compiler(source, primitiveDefinitions),
      error: null,
    };
  } catch (error) {
    return {
      tree: null,
      error:
        error instanceof Error
          ? error.message
          : "The JSX could not be rendered.",
    };
  }
}

function App() {
  const [source, setSource] = useState(INITIAL_SAMPLE.source);
  const [selectedSample, setSelectedSample] = useState<SourceChoice>(
    INITIAL_SAMPLE.id,
  );
  const [canvasWidth, setCanvasWidth] = useState<CanvasWidth>("phone");
  const [zoom, setZoom] = useState(90);
  const [showAnatomy, setShowAnatomy] = useState(true);
  const [showStateVariants, setShowStateVariants] = useState(false);
  const [compiler, setCompiler] = useState<Compiler | null>(null);
  const [compilerLoadError, setCompilerLoadError] = useState<string | null>(
    null,
  );
  const [editorScrollTop, setEditorScrollTop] = useState(0);
  const deferredSource = useDeferredValue(source);
  const result = useMemo(
    () =>
      compiler
        ? compile(deferredSource, compiler)
        : { tree: null, error: compilerLoadError },
    [compiler, compilerLoadError, deferredSource],
  );
  const sourceIsPending = source !== deferredSource;
  const lineCount = source.split("\n").length;

  useEffect(() => {
    let active = true;

    void import("./wireframe/compile")
      .then((module) => {
        if (active) setCompiler(() => module.compileLayer2Jsx);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setCompilerLoadError(
          error instanceof Error
            ? error.message
            : "The JSX parser could not load.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  function selectSample(id: SampleId) {
    const sample = samples.find((candidate) => candidate.id === id);
    if (!sample) return;

    startTransition(() => {
      setSelectedSample(id);
      setSource(sample.source);
      setCanvasWidth(id === "luma-home" ? "phone" : "desktop");
    });
  }

  function loadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    void file.text().then((text) => {
      startTransition(() => {
        setSource(text);
        setSelectedSample("custom");
      });
    });
    event.target.value = "";
  }

  const scaleStyle = {
    "--preview-scale": String(zoom / 100),
  } as CSSProperties;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#wireframe-canvas">
        Skip to wireframe
      </a>

      <header className="app-header">
        <div className="wordmark" aria-label="UI AST Wireframe">
          <span className="wordmark-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>
            UI AST
            <small>Wireframe</small>
          </span>
        </div>

        <div className="header-status" aria-live="polite">
          <span className={result.error ? "status-dot error" : "status-dot"} />
          {sourceIsPending
            ? "Rendering…"
            : !compiler && !result.error
              ? "Loading JSX parser…"
              : result.error
                ? "Syntax needs attention"
                : `${primitiveCount} primitives ready`}
        </div>

        <a
          className="spec-link"
          href="https://github.com/BowangLan/ui-ast/blob/main/SPEC.md"
          target="_blank"
          rel="noreferrer"
        >
          Read the spec <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main className="workspace">
        <section className="source-pane" aria-label="JSX source editor">
          <div className="pane-heading">
            <div>
              <span className="eyebrow">Input / JSX</span>
              <h1>Describe the interface.</h1>
            </div>
            <label className="file-button">
              Open .jsx
              <input type="file" accept=".jsx,.tsx,.txt" onChange={loadFile} />
            </label>
          </div>

          <label className="sample-picker">
            <span>Reference case</span>
            <select
              value={selectedSample}
              onChange={(event) => selectSample(event.target.value as SampleId)}
            >
              {samples.map((sample) => (
                <option value={sample.id} key={sample.id}>
                  {sample.label}
                </option>
              ))}
              <option value="custom" disabled>
                Custom JSX
              </option>
            </select>
          </label>

          <div className="editor-frame">
            <div className="editor-rule" aria-hidden="true">
              <div
                className="editor-rule-track"
                style={{ transform: `translateY(-${editorScrollTop}px)` }}
              >
                {Array.from({ length: lineCount }, (_, index) => (
                  <span key={index}>{index + 1}</span>
                ))}
              </div>
            </div>
            <textarea
              value={source}
              onChange={(event) => {
                setSource(event.target.value);
                setSelectedSample("custom");
              }}
              onScroll={(event) =>
                setEditorScrollTop(event.currentTarget.scrollTop)
              }
              aria-label="Layer 2 JSX"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          <footer className="editor-footer">
            <span>{lineCount} lines</span>
            <span>Restricted JSX · live render</span>
          </footer>
        </section>

        <section className="preview-pane" aria-label="Wireframe preview">
          <div className="preview-toolbar">
            <div className="canvas-sizes" aria-label="Canvas width">
              {(["fit", "phone", "tablet", "desktop"] as const).map((width) => (
                <button
                  type="button"
                  key={width}
                  aria-pressed={canvasWidth === width}
                  onClick={() => setCanvasWidth(width)}
                >
                  <span className={`size-icon ${width}`} aria-hidden="true" />
                  {width === "fit" ? "Fit" : width}
                </button>
              ))}
            </div>

            <div className="preview-options">
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={showAnatomy}
                  onChange={(event) => setShowAnatomy(event.target.checked)}
                />
                <span />
                Anatomy
              </label>
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={showStateVariants}
                  onChange={(event) =>
                    setShowStateVariants(event.target.checked)
                  }
                />
                <span />
                States
              </label>
              <div className="zoom-control">
                <label htmlFor="preview-zoom">Zoom</label>
                <input
                  id="preview-zoom"
                  type="range"
                  min="50"
                  max="110"
                  step="10"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                />
                <output htmlFor="preview-zoom">{zoom}%</output>
              </div>
            </div>
          </div>

          <div className="wireframe-canvas" id="wireframe-canvas" tabIndex={-1}>
            <div className="canvas-ruler horizontal" aria-hidden="true" />
            <div className="canvas-ruler vertical" aria-hidden="true" />

            {!compiler && !result.error ? (
              <output className="compiler-loading">
                <span aria-hidden="true" />
                Preparing the JSX renderer…
              </output>
            ) : result.error ? (
              <div className="compile-error" role="alert">
                <span className="error-index">!</span>
                <div>
                  <span className="eyebrow">Could not render</span>
                  <h2>Check the JSX structure</h2>
                  <p>{result.error}</p>
                </div>
              </div>
            ) : (
              <div className="preview-scale" style={scaleStyle}>
                <div
                  className="preview-viewport"
                  data-canvas={canvasWidth}
                  style={{ width: CANVAS_WIDTHS[canvasWidth] }}
                >
                  <div className="viewport-label" aria-hidden="true">
                    {canvasWidth} / {CANVAS_WIDTHS[canvasWidth]}
                  </div>
                  <WireframeProvider
                    preferences={{ showAnatomy, showStateVariants }}
                  >
                    {result.tree}
                  </WireframeProvider>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
