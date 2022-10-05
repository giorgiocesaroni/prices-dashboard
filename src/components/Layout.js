import React from "react";
import { useRecoilState } from "recoil";
import { SelectedProductAtom } from "../context/recoil/atoms";
import { LineChart } from "../LineChart";
import Inspector from "./Inspector";
import { ProductsSidebar } from "./ProductsSidebar";

export default function Layout() {
  const selectedProduct = useRecoilState(SelectedProductAtom);
  return (
    <div className="layout">
      <h2 className="page-title">{selectedProduct ?? "Price Analysis"}</h2>
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
