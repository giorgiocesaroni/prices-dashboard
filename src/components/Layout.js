import React from "react";
import { LineChart } from "../LineChart";
import Inspector from "./Inspector";
import { ProductsSidebar } from "./ProductsSidebar";

export default function Layout() {
  return (
    <div className="layout">
      <h2 className="page-title">Price Analysis</h2>
      <main>
        <div className="card">
          <LineChart />
        </div>

        {/* <div style={{ display: "grid", gap: "1rem" }}> */}
        <ProductsSidebar />
        <Inspector />
        {/* </div> */}
      </main>
    </div>
  );
}
