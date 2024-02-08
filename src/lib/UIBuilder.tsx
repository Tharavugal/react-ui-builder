import { Box, Button, Tab, Tabs } from "@mui/material";
import Widgets from "./Widgets";
import { useEffect, useState } from "react";
import { getInObj, setInObj, delInObj } from "@opentf/utils";
import ReactJson from "@microlink/react-json-view";
import UIRenderer from "./UIRenderer";
import PropsEditor from "./PropsEditor";
import HeadingWidget from "./widgets/Heading";
import ContainerWidget from "./widgets/Container";
import BreadCrumbs from "./BreadCrumbs";
import TextWidget from "./widgets/Text";
import FlexWidget from "./widgets/Flex";
import RootWidget from "./widgets/Root";
import DividerWidget from "./widgets/Divider";
import ULWidget from "./widgets/UL";
import { Editor } from "@opentf/react-code-editor";

export default function UIBuilder() {
  const [tab, setTab] = useState(0);
  const [state, setState] = useState({
    code: null,
    data: "{}",
    selectionPath: "",
  });
  const widgets = [
    RootWidget(),
    ContainerWidget(),
    HeadingWidget(),
    TextWidget(),
    FlexWidget(),
    DividerWidget(),
    ULWidget(),
  ];

  useEffect(() => {
    const rootWidget = RootWidget();
    setState((s) => ({
      ...s,
      code: { name: rootWidget.name, ...rootWidget.component },
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
    const curObj = getInObj(state.code, objPath) ?? state.code;
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
      state.code,
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

    const UI = state.code;
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
        <Tab label="Data" />
        <Tab label="Code" />
      </Tabs>
      <Box sx={{ p: 3, height: "700px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <BreadCrumbs
            UI={state.code}
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
            {tab === 0 && (
              <UIRenderer
                code={state.code}
                getData={() => JSON.parse(state.data)}
                selectionPath={state.selectionPath}
                onSelect={setSelectionPath}
                edit
              />
            )}
            {tab === 1 && (
              <Editor
                title="Data"
                theme="Dark"
                value={state.data}
                onChange={(str) => setState({ ...state, data: str })}
                lang="JSON"
                style={{ height: "100%" }}
              />
            )}
            {tab === 2 && (
              <ReactJson
                src={state.code}
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
            component={getInObj(state.code, state.selectionPath) ?? state.code}
            onUpdate={handlePropUpdate}
          />
        </Box>
      </Box>
    </>
  );
}
