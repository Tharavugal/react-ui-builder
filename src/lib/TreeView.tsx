import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { TreeView as MUITreeView, TreeItem } from "@mui/x-tree-view";
import type { JsonObject } from "type-fest";

type Props = {
  UI: JsonObject;
  selectionPath: string;
  setSelectionPath: (s: string) => void;
};

export default function TreeView({
  UI,
  selectionPath,
  setSelectionPath,
}: Props) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [showTreeView, setShowTreeView] = useState(false);

  const handleToggle = (_e: unknown, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (_e: unknown, nodeIds: string) => {
    setSelected(nodeIds);
    setSelectionPath(nodeIds as string);
  };

  const renderTreeItems = (pNode: JsonObject, key: string) => (
    <TreeItem key={key} nodeId={key} label={pNode.name as string}>
      {Array.isArray(pNode.children)
        ? pNode.children.map((node, i) =>
            renderTreeItems(node as JsonObject, `${key}.children[${i}]`)
          )
        : null}
    </TreeItem>
  );

  const getExpandedNodes = () => {
    const out = [""];
    let curStr = "";
    selectionPath
      .split(".")
      .slice(1)
      .forEach((s) => {
        curStr = curStr + "." + s;
        out.push(curStr);
      });
    return out;
  };

  useEffect(() => {
    setExpanded(getExpandedNodes());
    setSelected(selectionPath);
  }, [showTreeView]);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        color="info"
        sx={{ mr: 2, alignSelf: "center" }}
        onClick={() => setShowTreeView(true)}
      >
        Tree
      </Button>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => setShowTreeView(false)}
        open={showTreeView}
      >
        <DialogTitle>UI Tree</DialogTitle>
        <Box sx={{ my: 1, px: 2 }}>
          <MUITreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            selected={selected}
            onNodeSelect={handleSelect}
            onNodeToggle={handleToggle}
          >
            {UI && renderTreeItems(UI, "")}
          </MUITreeView>
        </Box>
      </Dialog>
    </>
  );
}
