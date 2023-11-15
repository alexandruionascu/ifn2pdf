import { createRoot } from "react-dom/client";
import { App } from "./App";
import { MantineProvider, createTheme } from "@mantine/core";
import '@mantine/core/styles.css';
import 'reflect-metadata';
import './boxmodel/BoxModel'


const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <MantineProvider>
    <App />
  </MantineProvider>
);
