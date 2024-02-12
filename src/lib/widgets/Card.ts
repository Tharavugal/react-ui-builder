import { Widget } from "../types";

export default function CardWidget() {
  const w: Widget = {
    name: "Card",
    group: "Surface",
    component: {
      props: { sx: { p: 1, m: 1 } },
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
