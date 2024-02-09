import { Box, Button, Dialog, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView as MUITreeView, TreeItem } from "@mui/x-tree-view";

type Props = {
  UI: Record<string, unknown> | null;
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

  const renderTreeItems = (pNode: Record<string, unknown>, key: string) => (
    <TreeItem key={key} nodeId={key} label={pNode.name as string}>
      {Array.isArray(pNode.children)
        ? pNode.children.map((node, i) =>
            renderTreeItems(node, `${key}.children[${i}]`)
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
        color="secondary"
        sx={{ mr: 2 }}
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
            aria-label="file system navigator"
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
