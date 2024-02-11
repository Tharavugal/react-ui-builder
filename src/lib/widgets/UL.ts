export default function ULWidget() {
  return {
    name: "UL",
    group: "List",
    component: {
      props: { binding: null, sx: {} },
      children: [],
    },
    propTypes: [
      { name: "binding", type: "binding", label: "Data Binding" },
      {
        name: "sx",
        type: "code",
        label: "Styles",
        lang: "json",
      },
    ],
  };
}
