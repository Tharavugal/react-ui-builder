import { Box, Button, IconButton } from "@mui/material";
import TreeView from "./TreeView";
import BreadCrumbs from "./BreadCrumbs";
import { delInObj, getInObj } from "@opentf/utils";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getCurIndex, parentPath } from "./utils";
import { move } from "@opentf/utils";

export default function ActionsBar({
  code,
  selectionPath,
  setSelectionPath,
  setState,
}) {
  const handleDelete = () => {
    if (!selectionPath) {
      return;
    }

    const UI = code;
    if (delInObj(UI, selectionPath)) {
      setState((s) => ({ ...s, UI, selectionPath: parentPath(selectionPath) }));
    }
  };

  const handleMoveUp = () => {
    const index = getCurIndex(selectionPath);
    if (index === 0) {
      return;
    }
    const path = parentPath(selectionPath);
    const arr = getInObj(code, path + ".children");
    move(arr as unknown[], index, index - 1);
    setState((s) => ({
      ...s,
      selectionPath: path + `.children[${index - 1}]`,
    }));
  };

  const handleMoveDown = () => {
    const index = getCurIndex(selectionPath);
    const path = parentPath(selectionPath);
    const arr = getInObj(code, path + ".children") as unknown[];
    if (index >= arr.length - 1) {
      return;
    }
    move(arr as unknown[], index, index + 1);
    setState((s) => ({
      ...s,
      selectionPath: path + `.children[${index + 1}]`,
    }));
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Box sx={{ display: "flex" }}>
        <TreeView
          UI={code}
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
      </Box>
    </Box>
  );
}
