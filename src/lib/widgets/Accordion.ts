export default function AccordionWidget() {
  return {
    name: "Accordion",
    group: "Surface",
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
