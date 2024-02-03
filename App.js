import React from "react";
import {NativeBaseProvider} from "native-base";
import Routes from "./src/routes";
import customTheme from "./src/customTheme";

export default function App() {
  return (
      <NativeBaseProvider theme={customTheme}>
        <Routes />
      </NativeBaseProvider>
  );
}