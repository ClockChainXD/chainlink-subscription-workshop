import "./index.css";

import { DAppProvider, Mainnet } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// IMPORTANT, PLEASE READ
// To avoid disruptions in your app, change this to your own Infura project id.
// https://infura.io/register
const INFURA_PROJECT_ID = "529670718fd74cd2a041466303daecd7";
const config = {
  readOnlyChainId: 97,
  readOnlyUrls: {
    [97]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
}

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
        <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
