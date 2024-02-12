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
import AccordionWidget from "./widgets/Accordion";
import CardWidget from "./widgets/Card";
import type { JsonObject } from "type-fest";
import type { Component } from "./types";

export type Props = {
  code: Component | null;
  data: string;
  onSave: (values: { code: JsonObject; data: string }) => void;
};

type StateType = {
  code: Component | null;
  data: string;
  selectionPath: string;
};

export default function Builder({ code, data, onSave }: Props) {
  const [tab, setTab] = useState(0);
  const [state, setState] = useState<StateType>({
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
    AccordionWidget(),
    CardWidget(),
  ];

  useEffect(() => {
    const rootWidget = RootWidget();
    setState((s) => ({
      ...s,
      code: code ?? {
        ...rootWidget.component,
        name: rootWidget.name,
      },
      data: data ?? "{}",
    }));
  }, [code, data]);

  const insert = (component: Component, insertMode: string) => {
    if (insertMode === "sibling" && state.selectionPath === "") {
      return;
    }

    const objPath =
      insertMode === "child"
        ? state.selectionPath
        : parentPath(state.selectionPath);
    const curObj =
      (getInObj(state.code as unknown as object, objPath) as JsonObject) ??
      state.code;
    if (!curObj) {
      return;
    }
    const index =
      insertMode === "child"
        ? ((curObj.children as unknown[]) ?? []).length
        : getCurIndex(state.selectionPath) + 1;
    const curSelectionPath = `${objPath}.children[${index}]`;
    ((curObj.children as unknown[]) ?? []).splice(index, 0, component);
    setState({
      ...state,
      selectionPath: curSelectionPath,
    });
  };

  const handlePropUpdate = (propName: string, val: unknown) => {
    setInObj(
      state.code as unknown as object,
      `${state.selectionPath}.props.${propName}`,
      val
    );
    setState({ ...state });
  };

  const setSelectionPath = (path: string) => {
    setState((s) => ({ ...s, selectionPath: path }));
  };

  return (
    <>
      <Tabs value={tab} onChange={(_e, val) => setTab(val)} centered>
        <Tab label="Preview" />
        <Tab label="Data" />
        <Tab label="Code" />
      </Tabs>
      <Box sx={{ p: 3, height: "700px" }}>
        <ActionsBar
          code={state.code}
          data={state.data}
          selectionPath={state.selectionPath}
          setSelectionPath={setSelectionPath}
          onSave={onSave}
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
                data={JSON.parse(state.data)}
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
                  } catch (error) {
                    console.log(error);
                  }
                }}
                lang="JSON"
                style={{ height: "100%" }}
              />
            )}
            {tab === 2 && (
              <ReactJson
                src={state.code as unknown as object}
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
            code={state.code}
            selectionPath={state.selectionPath}
            data={state.data}
            onUpdate={handlePropUpdate}
          />
        </Box>
      </Box>
    </>
  );
}