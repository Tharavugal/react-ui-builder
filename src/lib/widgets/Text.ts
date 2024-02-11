export default function TextWidget() {
  return {
    name: "Text",
    group: "Text",
    component: {
      props: { binding: null, text: "", sx: {} },
    },
    propTypes: [
      { name: "binding", type: "binding", label: "Data Binding" },
      { name: "text", type: "text", multi: true, label: "Text" },
      {
        name: "sx",
        type: "code",
        label: "SX",
        lang: "json",
      },
    ],
  };
}
