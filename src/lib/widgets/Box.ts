export default function BoxWidget() {
  return {
    name: "Box",
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
}
