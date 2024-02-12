import { Widget } from "../types";

export default function DividerWidget() {
  const w: Widget = {
    name: "Divider",
    group: "Layout",
    component: {
      props: { sx: {} },
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
