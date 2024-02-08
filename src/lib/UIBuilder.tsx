import { Box, Button, Tab, Tabs } from "@mui/material";
import Widgets from "./Widgets";
import { useEffect, useState } from "react";
import { getInObj, setInObj, delInObj } from "@opentf/utils";
import ReactJson from "@microlink/react-json-view";
import UIRenderer from "./UIRenderer";
import PropsEditor from "./PropsEditor";
import HeadingWidget from "./widgets/Heading";
import BoxWidget from "./widgets/Box";
import BreadCrumbs from "./BreadCrumbs";
import TextWidget from "./widgets/Text";
import FlexWidget from "./widgets/Flex";
import RootWidget from "./widgets/Root";

export default function UIBuilder() {
  const [tab, setTab] = useState(0);
  const [state, setState] = useState({
    UI: null,
    selectionPath: "",
  });
  const widgets = [
    RootWidget(),
    BoxWidget(),
    HeadingWidget(),
    TextWidget(),
    FlexWidget(),
  ];

  useEffect(() => {
    const rootWidget = RootWidget();
    setState((s) => ({
      ...s,
      UI: { name: rootWidget.name, ...rootWidget.component },
    }));
  }, []);

  const insert = (
    name: string,
    obj: Record<string, unknown>,
    insertMode: string
  ) => {
    if (insertMode === "sibling" && state.selectionPath === "") {
      return;
    }

    const objPath =
      insertMode === "child"
        ? state.selectionPath
        : state.selectionPath.split(".").slice(0, -1).join(".");
    const curObj = getInObj(state.UI, objPath) ?? state.UI;
    const index =
      insertMode === "child"
        ? (curObj.children ?? []).length
        : Number(state.selectionPath.split(".").slice(-1)[0].match(/\d+/)[0]) +
          1;
    const curSelectionPath = `${objPath}.children[${index}]`;
    (curObj.children ?? []).splice(index, 0, { name, ...obj });
    setState({
      ...state,
      selectionPath: curSelectionPath,
    });
  };

  const handlePropUpdate = (propName: string, val: unknown) => {
    const UI = setInObj(
      state.UI,
      `${state.selectionPath}.props.${propName}`,
      val
    );
    setState({ ...state, UI });
  };

  const setSelectionPath = (path: string) => {
    setState((s) => ({ ...s, selectionPath: path }));
  };

  const handleDelete = () => {
    if (!state.selectionPath) {
      return;
    }

    const UI = state.UI;
    if (delInObj(UI, state.selectionPath)) {
      const selectionPath = state.selectionPath
        .split(".")
        .slice(0, -1)
        .join(".");
      setState((s) => ({ ...s, UI, selectionPath }));
    }
  };

  return (
    <>
      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        <Tab label="Preview" />
        <Tab label="Code" />
      </Tabs>
      <Box sx={{ p: 3, height: "700px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <BreadCrumbs
            UI={state.UI}
            selectionPath={state.selectionPath}
            setSelectionPath={setSelectionPath}
          />
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "15% 25px 1fr 25px 15%",
            height: "100%",
          }}
        >
          <Widgets widgets={widgets} onInsert={insert} />
          <Box></Box>
          <Box
            sx={{
              border: "1px solid lightgray",
              backgroundColor: "lightgray",
              overflowY: "auto",
            }}
          >
            {tab === 0 ? (
              <UIRenderer
                tree={state.UI}
                selectionPath={state.selectionPath}
                onSelect={setSelectionPath}
                edit
              />
            ) : (
              <ReactJson
                src={state.UI}
                theme="google"
                name={false}
                enableClipboard={false}
                displayDataTypes={false}
              />
            )}
          </Box>
          <Box></Box>
          <PropsEditor
            widgets={widgets}
            component={getInObj(state.UI, state.selectionPath) ?? state.UI}
            onUpdate={handlePropUpdate}
          />
        </Box>
      </Box>
    </>
  );
}
