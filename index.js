import { createRoot } from "react-dom/client";
import { App } from "./App";
import { MantineProvider, createTheme } from "@mantine/core";
// core styles are required for all packages
const theme = createTheme({
  fontFamily: "Lato, sans-serif",
  colorScheme: "light",
  lineHeight: 1.5,
  fontSizes: {
    xs: "0.75rem", // Extra small size
    sm: "0.875rem", // Small size
    md: "1rem", // Medium size
    lg: "1.125rem", // Large size
    xl: "1.25rem", // Extra large size
  },
  colors: {
    blue: ["#008AFD"],
    dark: ["#4D5460", "#303439"],
    gray: ["#F0F0F2", "#ECEFF7", "#F1F2F4"],
    white: ["#FFFFFF"],
    lightBlue: ["#C8F0FF"],
  },
  components: {
    Button: {
      // Subscribe to theme and component params
      styles: (theme, params, { variant }) =>
        ({
          primary: {
            root: {
              backgroundColor: theme.colors.blue,
              border: 0,
              color: theme.colors.white,
              height: rem(42),
              fontSize: theme.fontSizes.xs,
              paddingRight: rem(23),
              paddingLeft: rem(23),
              paddingTop: 0,
              paddingBottom: 0,
              "&:not([data-disabled])": theme.fn.hover({
                backgroundColor: theme.fn.darken(theme.colors.blue[0], 0.05),
              }),
            },
            leftIcon: {
              marginRight: theme.spacing.md,
            },
          },
          outline: {
            root: {
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: theme.colors.gray[0],
              height: rem(42),
              paddingRight: rem(23),
              paddingLeft: rem(23),
              paddingTop: 0,
              paddingBottom: 0,
              fontSize: theme.fontSizes.xs,
              "&:not([data-disabled])": theme.fn.hover({
                //backgroundColor: theme.fn.darken(theme.colors.gray[0], 0.05),
              }),
            },
            leftIcon: {
              marginRight: theme.spacing.xs,
            },
          },
        }[variant]),
    },
    Link: {
      styles: (theme, params, { variant }) => ({
        root: {
          color: "red",
          borderRadius: "4px",
        },
      }),
    },
    Divider: {
      styles: (theme, params, { variant }) => ({
        root: {
          color: theme.colors.gray[1],
        },
      }),
    },
    Input: {
      styles: (theme, params, { variant }) => ({
        input: {
          borderWidth: variant == "unstyled" || variant == "centered" ? 0 : 1,
          borderStyle: "solid",
          borderColor: theme.colors.gray[1],
          textAlign: variant == "centered" ? "center" : "left",
        },
      }),
    },
    InputWrapper: {
      styles: (theme) => ({
        label: {
          paddingBottom: theme.spacing.xs,
        },
        description: {
          color: theme.colors.dark[0],
          fontSize: theme.fontSizes.xs,
        },
      }),
    },
    NumberInput: {
      styles: (theme) => ({
        control: {
          border: "none",
        },
      }),
    },
    Checkbox: {
      styles: (theme) => ({
        input: {
          background: theme.colors.blue[0],
        },
      }),
    },
    Radio: {
      styles: (theme) => ({
        radio: {
          background: theme.colors.blue[0],
        },
      }),
    },
  },
});

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
