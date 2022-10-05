import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/App.css";
import "./assets/css/index.css";
import { RecoilRoot } from "recoil";
import Layout from "./components/Layout";
import Firestore from "./components/Firestore";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <Firestore>
      <Layout />
    </Firestore>
  </RecoilRoot>
);
