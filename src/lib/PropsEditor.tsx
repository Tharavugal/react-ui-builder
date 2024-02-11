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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { isObj } from "@opentf/utils";

function BindingPropField({ name, data, onUpdate, value }) {
  const [opem, setOpen] = useState(false);
  const [dataPath, setDataPath] = useState("");

  const handleSelect = (_e, nodeIds) => {
    setDataPath(nodeIds);
    if (nodeIds) {
    }
  };

  const renderTreeItems = (pNode, name, key) => {
    const keys = isObj(pNode) ? Object.keys(pNode) : [];

    return (
      <TreeItem key={key} nodeId={key} label={name}>
        {keys.map((node) =>
          renderTreeItems(pNode[node], node, `${key}.${node}`)
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

export default function PropsEditor({ widgets, component, onUpdate, data }) {
  if (!component) {
    return null;
  }

  const widget = widgets.find((w) => w.name === component.name);

  const renderFields = () => {
    const fields = widget.propTypes.map((pt, i) => {
      switch (pt.type) {
        case "binding":
          return (
            <BindingPropField
              key={i}
              name={pt.name}
              data={data}
              onUpdate={onUpdate}
              value={component.props[pt.name]}
            />
          );
        case "text":
          return (
            <TextField
              multiline={pt.multi}
              sx={{ my: 1 }}
              key={i}
              label={pt.label}
              value={component.props[pt.name]}
              onChange={(e) => onUpdate(pt.name, e.target.value)}
            />
          );
        case "select":
          return (
            <FormControl key={i} fullWidth sx={{ my: 1 }}>
              <InputLabel id="select-label">{pt.label}</InputLabel>
              <Select
                labelId="select-label"
                key={i}
                label={pt.label}
                value={component.props[pt.name]}
                onChange={(e) => onUpdate(pt.name, e.target.value)}
              >
                {pt.options.map((o, i) => (
                  <MenuItem key={i} value={o.value}>
                    {o.label}
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
