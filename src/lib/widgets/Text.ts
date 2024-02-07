export default function TextWidget() {
  return {
    name: "Text",
    group: "Text",
    component: {
      props: { text: "", sx: {} },
    },
    propTypes: [
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
