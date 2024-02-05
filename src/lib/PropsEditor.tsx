import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export default function PropsEditor({ widgets, component, onUpdate }) {
  const widget = widgets.find((w) => w.name === component.name);

  const renderFields = () => {
    if (!widget) {
      return null;
    }

    const fields = widget.propTypes.map((pt, i) => {
      switch (pt.type) {
        case "text":
          return (
            <TextField
              sx={{ my: 1 }}
              key={i}
              label={pt.label}
              value={component.props[pt.name]}
              onChange={(e) => onUpdate(pt.name, e.target.value)}
            />
          );
        case "select":
          return (
            <FormControl key={i} fullWidth sx={{ my: 1 }}>
              <InputLabel id="select-label">{pt.label}</InputLabel>
              <Select
                labelId="select-label"
                key={i}
                label={pt.label}
                value={component.props[pt.name]}
                onChange={(e) => onUpdate(pt.name, e.target.value)}
              >
                {pt.options.map((o, i) => (
                  <MenuItem key={i} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        default:
          return null;
      }
    });

    return fields;
  };

  return (
    <Box
      sx={{
        height: "100%",
        border: "1px solid lightgray",
        p: 1,
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          color: (t) => t.palette.secondary.main,
        }}
        variant="body1"
      >
        PROPS
      </Typography>
      <Box sx={{ mt: 2 }}>{renderFields()}</Box>
    </Box>
  );
}
