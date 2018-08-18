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
        background: "#f12711",
        background: "linear-gradient(45deg, #f40339, #f5af19)",
        backgroundImage: "linear-gradient(45deg, #f40339, #f5af19)",
        backgroundSize: "200% 200%",
        backgroundPosition: "0 0",
        transition: "background-position 500ms ease-in-out",
        "&:hover": {
          backgroundPosition: "100% 100%",
          transition: "background-position 500ms ease-in-out"
        }
      }
    }
  }
});
