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
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        "&:hover": {
          background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)"
        },
        transition: "all 300ms ease-in-out"
      }
    }
  }
});
