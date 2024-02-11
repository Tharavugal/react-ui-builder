import { createElement } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { getInObj } from "@opentf/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {
  code: Record<string, unknown>;
  getData: () => Record<string, unknown>;
  selectionPath: string;
  onSelect: (p: string) => void;
  edit: boolean;
};

export default function Renderer({
  code,
  getData,
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
    const styles = { ...sx };
    const props = { key, ...otherProps };

    if (edit) {
      styles["border"] =
        selectionPath === compCurPath ? "1px dashed red" : styles["border"];
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
      case "Container": {
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
        const { text, binding, ...restProps } = props;
        const txt = binding ? getInObj(getData(), binding) : text;

        return createElement(
          Typography,
          { sx: { p: 0, ...styles }, variant: "h6", ...restProps },
          txt
        );
      }
      case "Text": {
        const { text, binding, ...restProps } = props;
        const txt = binding ? getInObj(getData(), binding) : text;

        return createElement(
          Typography,
          { sx: { ...styles }, variant: "body1", ...restProps },
          txt
        );
      }
      case "Divider": {
        const { ...restProps } = props;

        return createElement(
          Divider,
          { sx: { borderColor: "darkgray", ...styles }, ...restProps },
          null
        );
      }
      case "UL": {
        const { binding, ...restProps } = props;
        const items = binding ? getInObj(getData(), binding) : [];

        return createElement(
          Box,
          { component: "ul", sx: { ...styles }, ...restProps },
          items.map((it, i) => <li key={i}>{it}</li>)
        );
      }
      case "Accordion": {
        const { binding, ...restProps } = props;
        const obj = binding ? getInObj(getData(), binding) : {};

        return (
          <Accordion key={key} sx={{ ...styles }} {...restProps}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {obj.title}
            </AccordionSummary>
            <AccordionDetails>{obj.text}</AccordionDetails>
          </Accordion>
        );
      }
      case "Card": {
        const { ...restProps } = props;

        return (
          <Card sx={{ ...styles }} {...restProps} variant="outlined">
            <CardContent>
              {renderChildren(obj.children, compCurPath)}
            </CardContent>
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

  return <Box>{renderComponent(code, "")}</Box>;
}
