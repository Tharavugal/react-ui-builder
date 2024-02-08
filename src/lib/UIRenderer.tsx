import { Box, Card, CardContent, Typography } from "@mui/material";
import { createElement } from "react";

type Props = {
  tree: Record<string, unknown>;
  selectionPath: string;
  onSelect: (p: string) => void;
  edit: boolean;
};

export default function UIRenderer({
  tree,
  selectionPath,
  onSelect,
  edit = false,
}: Props) {
  const renderComponent = (
    obj: Record<string, unknown>,
    path: string,
    key = null
  ) => {
    if (!obj) {
      return null;
    }

    const compCurPath = key === null ? path : path + `.children[${key}]`;
    const { sx, ...otherProps } = obj.props as object;
    const styles = { ...sx, p: 1 };
    const props = { key, ...otherProps };

    if (edit) {
      styles["border"] =
        selectionPath === compCurPath ? "1px dashed red" : "initial";
      props["onClick"] = (e) => {
        e.stopPropagation();
        onSelect(compCurPath);
      };
    }

    switch (obj.name) {
      case "Root": {
        return createElement(
          Box,
          { key: "Root", sx: { ...styles } },
          renderChildren(obj.children, compCurPath)
        );
      }
      case "Box": {
        return createElement(
          Box,
          { sx: { ...styles }, ...props },
          renderChildren(obj.children, compCurPath)
        );
      }
      case "Flex": {
        return createElement(
          Box,
          { sx: { ...styles, display: "flex", flexWrap: "wrap" }, ...props },
          renderChildren(obj.children, compCurPath)
        );
      }

      case "Heading": {
        const { text, ...restProps } = props;
        return createElement(
          Typography,
          { sx: { ...styles }, variant: "h6", ...restProps },
          text
        );
      }
      case "Text": {
        const { text, ...restProps } = props;
        return createElement(
          Typography,
          { sx: { ...styles }, variant: "body1", ...restProps },
          text
        );
      }
      case "Card": {
        const { sx, otherProps } = obj.props;
        return (
          <Card sx={sx}>
            <CardContent>{renderChildren(otherProps.children)}</CardContent>
          </Card>
        );
      }
      default:
        return null;
    }
  };

  const renderChildren = (chldrn, path) => {
    return chldrn.map((obj, i) => {
      return renderComponent(obj, path, i);
    });
  };

  return <Box>{renderComponent(tree, "")}</Box>;
}
