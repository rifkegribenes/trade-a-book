import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  palette: {
    primary: {
      main: "#6200ea"
    },
    secondary: {
      main: "#FE6B8B"
    }
  },
  overrides: {
    MuiButton: {
      root: {
        background: "linear-gradient(45deg, #f12711, #f5af19);",
        "&:hover": {
          background: "linear-gradient(45deg, #f5af19, #f12711);"
        },
        transition: "all 300ms ease-in-out"
      }
    }
  }
});
