export default function RootWidget() {
  return {
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
}
