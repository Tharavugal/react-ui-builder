import { Box, Tab, Tabs } from "@mui/material";
import Widgets from "./Widgets";
import { useEffect, useState } from "react";
import { getInObj, setInObj } from "@opentf/utils";
import ReactJson from "@microlink/react-json-view";
import Renderer from "./Renderer";
import PropsEditor from "./PropsEditor";
import HeadingWidget from "./widgets/Heading";
import ContainerWidget from "./widgets/Container";
import TextWidget from "./widgets/Text";
import FlexWidget from "./widgets/Flex";
import RootWidget from "./widgets/Root";
import DividerWidget from "./widgets/Divider";
import ULWidget from "./widgets/UL";
import { Editor } from "@opentf/react-code-editor";
import ActionsBar from "./ActionsBar";
import { getCurIndex, parentPath } from "./utils";

export default function Builder() {
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
        : parentPath(state.selectionPath);
    const curObj = getInObj(state.code, objPath) ?? state.code;
    const index =
      insertMode === "child"
        ? (curObj.children ?? []).length
        : getCurIndex(state.selectionPath) + 1;
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

  return (
    <>
      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        <Tab label="Preview" />
        <Tab label="Data" />
        <Tab label="Code" />
      </Tabs>
      <Box sx={{ p: 3, height: "700px" }}>
        <ActionsBar
          code={state.code}
          selectionPath={state.selectionPath}
          setSelectionPath={setSelectionPath}
          setState={setState}
        />
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
              <Renderer
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
                onChange={(str) => {
                  try {
                    JSON.parse(str);
                    setState({ ...state, data: str });
                  } catch (error) {}
                }}
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
            data={state.data}
          />
        </Box>
      </Box>
    </>
  );
}
