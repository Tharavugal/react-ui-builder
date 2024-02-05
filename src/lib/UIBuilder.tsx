import { Box, Tab, Tabs } from "@mui/material";
import Widgets from "./Widgets";
import { useEffect, useState } from "react";
import { getInObj, setInObj } from "@opentf/utils";
import ReactJson from "@microlink/react-json-view";
import UIRenderer from "./UIRenderer";
import PropsEditor from "./PropsEditor";
import HeadingWidget from "./widgets/Heading";
import BoxWidget from "./widgets/Box";

export default function UIBuilder() {
  const [tab, setTab] = useState(0);
  const [state, setState] = useState({
    UI: {
      Root: null,
    },
    selectionPath: "Root",
  });
  const widgets = [BoxWidget(), HeadingWidget()];

  useEffect(() => {
    const boxWidget = BoxWidget();
    setState((s) => ({
      ...s,
      UI: { Root: { name: boxWidget.name, ...boxWidget.component } },
    }));
  }, []);

  useEffect(() => {
    console.log(state.selectionPath);
  }, [state.selectionPath]);

  const insert = (name, obj) => {
    const curObj = getInObj(state.UI, state.selectionPath) ?? state.UI;
    const len = (curObj["children"] as Array<unknown>).push(obj);
    const curSelectionPath = `${state.selectionPath}.children[${len - 1}]`;
    const UI = setInObj(state.UI, curSelectionPath, { name, ...obj });
    setState({ ...state, UI, selectionPath: curSelectionPath });
  };

  const handlePropUpdate = (propName, val) => {
    const UI = setInObj(
      state.UI,
      `${state.selectionPath}.props.${propName}`,
      val
    );
    setState({ ...state, UI });
  };

  return (
    <>
      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        <Tab label="Preview" />
        <Tab label="Code" />
      </Tabs>
      <Box sx={{ p: 3, height: "700px" }}>
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
              <UIRenderer tree={state.UI.Root} />
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
