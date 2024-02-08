export default function ULWidget() {
  return {
    name: "UL",
    group: "List",
    component: {
      props: { items: ["line 1", "line 2"], sx: {} },
      children: [],
    },
    propTypes: [
      {
        name: "items",
        type: "listItems",
        label: "Items",
      },
      {
        name: "sx",
        type: "code",
        label: "Styles",
        lang: "json",
      },
    ],
  };
}
