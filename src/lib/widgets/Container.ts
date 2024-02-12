import { Widget } from "../types";

export default function ContainerWidget() {
  const w: Widget = {
    name: "Container",
    group: "Layout",
    component: {
      props: { sx: { p: 1 } },
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
