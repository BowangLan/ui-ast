import { createContext } from "react";

import type { ViewerPreferences } from "./types";

export const ViewerContext = createContext<ViewerPreferences>({
  showAnatomy: true,
  showStateVariants: false,
});
