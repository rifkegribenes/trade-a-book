import { createMuiTheme } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import pink from "@material-ui/core/colors/pink";
import purple from "@material-ui/core/colors/purple";

export default createMuiTheme({
  palette: {
    primary: pink,
    secondary: indigo
  },
  overrides: {
    MuiButton: {
      root: {
        color: "white",
        "&:hover": {
          backgroundColor: "purple"
        }
      }
    }
  }
});
