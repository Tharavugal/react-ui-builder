export default function ContainerWidget() {
  return {
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
}
