import { Box, Card, CardContent, Typography } from "@mui/material";

export default function UIRenderer({ tree, selectionPath, onSelect }) {
  const renderComponent = (obj, path, key = null) => {
    const compCurPath = key === null ? path : path + `.children[${key}]`;

    if (!obj) {
      return null;
    }

    switch (obj.name) {
      case "Box": {
        const { sx, ...otherProps } = obj.props;

        return (
          <Box
            key={key}
            sx={{
              ...sx,
              border:
                selectionPath === compCurPath ? "1px dashed red" : undefined,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(compCurPath);
            }}
            {...otherProps}
          >
            {renderChildren(obj.children, compCurPath)}
          </Box>
        );
      }
      case "Flex": {
        const { sx, ...otherProps } = obj.props;

        return (
          <Box
            key={key}
            sx={{ display: "flex", flexWrap: "wrap", p: 1, ...sx }}
            {...otherProps}
          >
            {renderChildren(obj[name].children || [])}
          </Box>
        );
      }
      case "Heading": {
        const { text, sx, ...otherProps } = obj.props;

        return (
          <Typography
            key={key}
            sx={{
              ...sx,
              border:
                selectionPath === compCurPath ? "1px dashed red" : undefined,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(compCurPath);
            }}
            {...otherProps}
          >
            {text}
          </Typography>
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
      const comp = renderComponent(obj, path, i);
      return comp;
    });
  };

  return <Box>{renderComponent(tree, "")}</Box>;
}
