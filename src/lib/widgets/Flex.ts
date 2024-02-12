import { Widget } from "../types";

export default function FlexWidget() {
  const w: Widget = {
    name: "Flex",
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
