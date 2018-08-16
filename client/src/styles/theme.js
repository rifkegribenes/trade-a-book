import { createMuiTheme } from "@material-ui/core/styles";
import cyan from "@material-ui/core/colors/cyan";
import purple from "@material-ui/core/colors/purple";

export default createMuiTheme({
  palette: {
    primary: purple,
    secondary: cyan
  },
  overrides: {
    MuiButton: {
      root: {
        // color: "white",
        // "&:hover": {
        //   backgroundColor: purple
        // }
      }
    }
  }
});
