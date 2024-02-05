import { Box, Button, Divider, Typography } from "@mui/material";

function Btn({ sx = {}, ...OtherProps }) {
  return (
    <Button
      variant="outlined"
      size="small"
      sx={{ m: 1, ...sx }}
      {...OtherProps}
    />
  );
}

export default function Widgets({ onInsert, widgets }) {
  const groups = Object.groupBy(widgets, ({ group }) => group);

  const renderWidgets = (wa) => {
    return wa.map((w, i) => (
      <Btn key={i} onClick={() => onInsert(w.name, w.component)}>
        {w.name}
      </Btn>
    ));
  };

  const renderWidgetGroups = () => {
    return Object.keys(groups).map((g, i) => (
      <Box key={i}>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          {g}
        </Typography>
        <Divider />
        <Box sx={{ mt: 2 }}>{renderWidgets(groups[g])}</Box>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        border: "1px solid lightgray",
        p: 1,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          color: (t) => t.palette.secondary.main,
        }}
      >
        WIDGETS
      </Typography>
      {renderWidgetGroups()}
    </Box>
  );
}
