import { Box, ThemeProvider, Typography, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { UIBuilder } from "./lib";

const defaultTheme = createTheme({});

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">UI Builder</Typography>
        </Box>
        <UIBuilder />
      </ThemeProvider>
    </>
  );
}

export default App;
