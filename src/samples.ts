import dataTable from "../examples/data-table.jsx?raw";
import lumaHome from "../examples/luma-home.jsx?raw";
import masterDetail from "../examples/master-detail.jsx?raw";
import settings from "../examples/settings.jsx?raw";
import simpleList from "../examples/simple-list.jsx?raw";

export const samples = [
  { id: "luma-home", label: "Event feed", source: lumaHome },
  { id: "simple-list", label: "Project list", source: simpleList },
  { id: "data-table", label: "Data table", source: dataTable },
  { id: "settings", label: "Settings", source: settings },
  { id: "master-detail", label: "Master–detail", source: masterDetail },
] as const;

export type SampleId = (typeof samples)[number]["id"];
