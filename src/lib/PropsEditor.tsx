import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { TreeView as MUITreeView, TreeItem } from "@mui/x-tree-view";
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { getInObj, isObj } from "@opentf/utils";
import type { JsonObject } from "type-fest";
import type { Component, Widget } from "./types";

type BindingProps = {
  name: string;
  data: string;
  onUpdate: (name: string, value: string) => void;
  value: string;
};

function BindingPropField({ name, data, onUpdate, value }: BindingProps) {
  const [opem, setOpen] = useState(false);
  const [dataPath, setDataPath] = useState("");

  const handleSelect = (_e: React.SyntheticEvent, nodeIds: string) => {
    setDataPath(nodeIds);
  };

  const renderTreeItems = (pNode: JsonObject, name: string, key: string) => {
    const keys = isObj(pNode) ? Object.keys(pNode) : [];

    return (
      <TreeItem key={key} nodeId={key} label={name}>
        {keys.map((node) =>
          renderTreeItems(pNode[node] as JsonObject, node, `${key}.${node}`)
        )}
      </TreeItem>
    );
  };

  return (
    <>
      <Box>
        <Box>{value && <Chip label={value} />}</Box>
        <Button
          variant="outlined"
          color="primary"
          sx={{ my: 1 }}
          onClick={() => setOpen(true)}
        >
          Binding
        </Button>
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => setOpen(false)}
        open={opem}
      >
        <DialogTitle>Data Tree</DialogTitle>
        <Box sx={{ pb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Chip label={dataPath} />{" "}
            <Button
              variant="contained"
              size="small"
              onClick={() => onUpdate(name, dataPath)}
              sx={{ ml: 2 }}
            >
              Select
            </Button>
          </Box>
          <Box sx={{ my: 1, px: 2 }}>
            <MUITreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              onNodeSelect={handleSelect}
            >
              {renderTreeItems(JSON.parse(data), "Root", "")}
            </MUITreeView>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

type Props = {
  widgets: Widget[];
  code: Component | null;
  data: string;
  selectionPath: string;
  onUpdate: (name: string, value: string) => void;
};

export default function PropsEditor({
  widgets = [],
  code,
  data,
  selectionPath,
  onUpdate,
}: Props) {
  const component = (getInObj(code as unknown as object, selectionPath) ??
    code) as JsonObject;

  if (component === null) {
    return null;
  }

  const widget = widgets.find((w) => w.name === component.name);

  if (!widget) {
    return null;
  }

  const renderFields = () => {
    const fields = widget.propTypes.map((pt, i) => {
      if (!component.props) {
        return null;
      }

      switch (pt.type) {
        case "binding":
          return (
            <BindingPropField
              key={i}
              name={pt.name as string}
              data={data}
              onUpdate={onUpdate}
              value={
                (component.props as JsonObject)[pt.name as string] as string
              }
            />
          );
        case "text":
          return (
            <TextField
              multiline={pt.multi as boolean}
              sx={{ my: 1 }}
              key={i}
              label={pt.label as string}
              value={
                (component.props as JsonObject)[pt.name as string] as string
              }
              onChange={(e) => onUpdate(pt.name as string, e.target.value)}
            />
          );
        case "select":
          return (
            <FormControl key={i} fullWidth sx={{ my: 1 }}>
              <InputLabel id="select-label">{pt.label as string}</InputLabel>
              <Select
                labelId="select-label"
                key={i}
                label={pt.label as string}
                value={(component.props as JsonObject)[pt.name as string]}
                onChange={(e) =>
                  onUpdate(pt.name as string, e.target.value as string)
                }
              >
                {(pt.options as JsonObject[]).map((o, i) => (
                  <MenuItem key={i} value={o.value as string}>
                    {o.label as string}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        default:
          return null;
      }
    });

    return fields;
  };

  return (
    <Box
      sx={{
        height: "100%",
        border: "1px solid lightgray",
        p: 1,
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          color: (t) => t.palette.secondary.main,
        }}
        variant="body1"
      >
        PROPS
      </Typography>
      <Box sx={{ mt: 2 }}>{renderFields()}</Box>
    </Box>
  );
}
