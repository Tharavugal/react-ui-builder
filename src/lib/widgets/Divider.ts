export default function DividerWidget() {
  return {
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
}
