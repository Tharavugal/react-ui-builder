import { Box, ThemeProvider, Typography, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { Builder } from "./lib";
import { useEffect, useState } from "react";
import React from "react";

const defaultTheme = createTheme({});

function App() {
  const [state, setState] = useState({ code: null, data: "{}" });

  useEffect(() => {
    const UI = JSON.parse(sessionStorage.getItem("UI"));
    if (UI) {
      setState(UI);
    }
  }, []);

  const handleSave = (values) => {
    const data = JSON.stringify(values);
    sessionStorage.setItem("UI", data);
  };

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">UI Builder</Typography>
        </Box>
        <Builder code={state.code} data={state.data} onSave={handleSave} />
      </ThemeProvider>
    </>
  );
}

export default App;
