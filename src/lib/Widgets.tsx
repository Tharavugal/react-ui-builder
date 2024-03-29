import { Box, Button, Divider, Stack, Switch, Typography } from "@mui/material";
import { groupBy } from "@opentf/utils";
import { useState } from "react";
import { Component, Widget } from "./types";

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

type Props = {
  onInsert: (component: Component, insertMode: string) => void;
  widgets: Widget[];
};

export default function Widgets({ onInsert, widgets }: Props) {
  const [insertMode, setInsertMode] = useState("sibling");
  const groups = groupBy(
    widgets.filter((w) => w.group !== null),
    (w: Widget) => w.group as string
  );

  const renderWidgets = (wa: Widget[]) => {
    return wa.map((w, i) => (
      <Btn
        key={i}
        onClick={() => onInsert({ name: w.name, ...w.component }, insertMode)}
      >
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Child</Typography>
          <Switch
            checked={insertMode === "sibling"}
            onChange={(e) =>
              setInsertMode(e.target.checked ? "sibling" : "child")
            }
          />
          <Typography>Sibling</Typography>
        </Stack>
      </Box>
      {renderWidgetGroups()}
    </Box>
  );
}
