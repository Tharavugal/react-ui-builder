import { Widget } from "../types";

export default function RootWidget() {
  const w: Widget = {
    name: "Root",
    group: null,
    component: {
      props: { sx: { p: 1, background: "white" } },
      children: [],
    },
    propTypes: [
      {
        name: "sx",
        type: "code",
        label: "Styles",
        lang: "json",
      },
    ],
  };

  return w;
}
