import { ReactNode, SyntheticEvent, createElement } from "react";
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
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import type { JsonObject } from "type-fest";
import type { Component } from "./types";

type Props = {
  code: Component | null;
  data: JsonObject;
  selectionPath: string;
  onSelect: (p: string) => void;
  edit: boolean;
};

export default function Renderer({
  code,
  data,
  selectionPath,
  onSelect,
  edit = false,
}: Props) {
  if (code === null) {
    return null;
  }

  const renderComponent = (
    obj: Component,
    path: string,
    key: null | number
  ) => {
    if (!obj) {
      return null;
    }

    const compCurPath = key === null ? path : path + `.children[${key}]`;
    const { sx, ...otherProps } = obj.props;
    const styles = { ...sx };
    const props = { key, ...otherProps } as Record<string, unknown>;

    if (edit) {
      styles["border"] =
        selectionPath === compCurPath ? "1px dashed red" : styles["border"];
      props["onClick"] = (e: SyntheticEvent) => {
        e.stopPropagation();
        onSelect(compCurPath);
      };
    }

    switch (obj.name) {
      case "Root": {
        return createElement(
          Box,
          { key: "Root", sx: { ...styles } },
          renderChildren(obj.children || [], compCurPath)
        );
      }
      case "Container": {
        return createElement(
          Box,
          { sx: { ...styles }, ...props },
          renderChildren(obj.children || [], compCurPath)
        );
      }
      case "Flex": {
        return createElement(
          Box,
          { sx: { ...styles, display: "flex", flexWrap: "wrap" }, ...props },
          renderChildren(obj.children || [], compCurPath)
        );
      }

      case "Heading": {
        const { text, binding, ...restProps } = props;
        const txt = binding ? getInObj(data, binding as string) : text;

        return createElement(
          Typography,
          { sx: { p: 0, ...styles }, variant: "h6", ...restProps },
          txt as string
        );
      }
      case "Text": {
        const { text, binding, ...restProps } = props;
        const txt = binding ? getInObj(data, binding as string) : text;

        return createElement(
          Typography,
          { sx: { ...styles }, variant: "body1", ...restProps },
          txt as string
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
        const items = binding
          ? (getInObj(data, binding as string) as string[])
          : [];

        return createElement(
          Box,
          { component: "ul", sx: { ...styles }, ...restProps },
          items.map((it, i) => <li key={i}>{it}</li>)
        );
      }
      case "Accordion": {
        const { binding, ...restProps } = props;
        const obj = binding
          ? (getInObj(data, binding as string) as Record<string, string>)
          : {};

        return (
          <Accordion sx={{ ...styles }} {...restProps}>
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
              {renderChildren(obj.children as Component[], compCurPath)}
            </CardContent>
          </Card>
        );
      }
      default:
        return null;
    }
  };

  const renderChildren = (chldrn: Component[], path: string): ReactNode[] => {
    return chldrn.map((obj, i) => {
      return renderComponent(obj, path, i);
    });
  };

  return <Box>{renderComponent(code, "", null)}</Box>;
}
