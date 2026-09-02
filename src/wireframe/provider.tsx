import type { ReactNode } from "react";

import { ViewerContext } from "./context";
import type { ViewerPreferences } from "./types";

export function WireframeProvider({
  preferences,
  children,
}: {
  preferences: ViewerPreferences;
  children: ReactNode;
}) {
  return (
    <ViewerContext.Provider value={preferences}>
      <div
        className={preferences.showAnatomy ? "wf-root show-anatomy" : "wf-root"}
      >
        {children}
      </div>
    </ViewerContext.Provider>
  );
}
