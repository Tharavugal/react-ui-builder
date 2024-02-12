import { Box, Button, IconButton } from "@mui/material";
import TreeView from "./TreeView";
import BreadCrumbs from "./BreadCrumbs";
import { delInObj, getInObj } from "@opentf/utils";
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { getCurIndex, parentPath } from "./utils";
import { move } from "@opentf/utils";
import type { JsonObject } from "type-fest";
import { Component } from "./types";

type Props = {
  code: Component | null;
  data: string;
  selectionPath: string;
  setSelectionPath: (s: string) => void;
  onSave: (values: { code: JsonObject; data: string }) => void;
};

export default function ActionsBar({
  code,
  data,
  selectionPath,
  setSelectionPath,
  onSave,
}: Props) {
  const handleDelete = () => {
    if (!selectionPath) {
      return;
    }
    if (delInObj(code, selectionPath)) {
      setSelectionPath(parentPath(selectionPath));
    }
  };

  const handleSave = () => {
    onSave({ code: code as JsonObject, data });
  };

  const handleMoveUp = () => {
    const index = getCurIndex(selectionPath);
    if (index === 0) {
      return;
    }
    const path = parentPath(selectionPath);
    const arr = getInObj(code as unknown as object, path + ".children");
    move(arr as unknown[], index, index - 1);
    setSelectionPath(path + `.children[${index - 1}]`);
  };

  const handleMoveDown = () => {
    const index = getCurIndex(selectionPath);
    const path = parentPath(selectionPath);
    const arr = getInObj(
      code as unknown as object,
      path + ".children"
    ) as unknown[];
    if (index >= arr.length - 1) {
      return;
    }
    move(arr as unknown[], index, index + 1);
    setSelectionPath(path + `.children[${index + 1}]`);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Box sx={{ display: "flex" }}>
        <TreeView
          UI={code as JsonObject}
          selectionPath={selectionPath}
          setSelectionPath={setSelectionPath}
        />
        <BreadCrumbs
          UI={code}
          selectionPath={selectionPath}
          setSelectionPath={setSelectionPath}
        />
      </Box>
      <Box>
        <IconButton onClick={handleMoveUp}>
          <KeyboardArrowUpIcon />
        </IconButton>
        <IconButton onClick={handleMoveDown}>
          <KeyboardArrowDownIcon />
        </IconButton>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={handleSave}
          sx={{ ml: 1 }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
