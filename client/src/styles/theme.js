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
      containedSecondary: {
        background: "linear-gradient(45deg, #f40339, #f5af19)",
        backgroundImage: "linear-gradient(45deg, #f40339, #f5af19)",
        backgroundSize: "200% 200%",
        backgroundPosition: "0 0",
        transition: "background-position 500ms ease-in-out",
        "&:hover": {
          backgroundPosition: "100% 100%",
          transition: "background-position 500ms ease-in-out"
        }
      },
      raisedSecondary: {
        background: "linear-gradient(45deg, #f40339, #f5af19)",
        backgroundImage: "linear-gradient(45deg, #f40339, #f5af19)",
        backgroundSize: "200% 200%",
        backgroundPosition: "0 0",
        transition: "background-position 500ms ease-in-out",
        "&:hover": {
          backgroundPosition: "100% 100%",
          transition: "background-position 500ms ease-in-out"
        }
      },
      containedPrimary: {
        background: "linear-gradient(45deg, #6200ea, #f40339)",
        backgroundImage: "linear-gradient(45deg, #6200ea, #f40339)",
        backgroundSize: "200% 200%",
        backgroundPosition: "0 0",
        transition: "background-position 500ms ease-in-out",
        "&:hover": {
          backgroundPosition: "100% 100%",
          transition: "background-position 500ms ease-in-out"
        }
      },
      raisedPrimary: {
        background: "linear-gradient(45deg, #6200ea, #f40339)",
        backgroundImage: "linear-gradient(45deg, #6200ea, #f40339)",
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
