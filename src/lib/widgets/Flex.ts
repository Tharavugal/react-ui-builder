export default function FlexWidget() {
  return {
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
}
