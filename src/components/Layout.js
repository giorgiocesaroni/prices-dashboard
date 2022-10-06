import React from "react";
import { useRecoilState } from "recoil";
import { SelectedProductAtom } from "../context/recoil/atoms";
import { LineChart } from "../LineChart";
import DailyReport from "./DailyReport";
import Inspector from "./Inspector";
import { Products } from "./Products";

export default function Layout() {
  const selectedProduct = useRecoilState(SelectedProductAtom);
  return (
    <div className="layout">
      <h2 className="page-title">{selectedProduct ?? "Price Analysis"}</h2>
      <main>
        <DailyReport />
        <LineChart />
        <Inspector />
        <Products />
      </main>
    </div>
  );
}
