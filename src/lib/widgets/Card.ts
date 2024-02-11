export default function CardWidget() {
  return {
    name: "Card",
    group: 'Surface',
    component: {
      props: { sx: { p: 1, m: 1 } },
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
