import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  palette: {
    primary: {
      main: "#6200ea"
    },
    secondary: {
      main: "#f40339"
    },
    error: {
      main: "#f44336"
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 450,
      md: 600,
      lg: 1280,
      xl: 1920
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
