export default function HeadingWidget() {
  return {
    name: "Heading",
    group: "Text",
    component: {
      props: { text: "", binding: null, variant: "h6", sx: {} },
    },
    propTypes: [
      { name: "text", type: "text", label: "Text" },
      { name: "binding", type: "binding", label: "Data Binding" },
      {
        name: "variant",
        type: "select",
        label: "Variant",
        options: [
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
          { label: "H4", value: "h4" },
          { label: "H5", value: "h5" },
          { label: "H6", value: "h6" },
        ],
      },
      {
        name: "sx",
        type: "code",
        label: "SX",
        lang: "json",
      },
    ],
  };
}
