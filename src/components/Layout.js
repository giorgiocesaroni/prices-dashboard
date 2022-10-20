import React from "react";
import ComparatorReport from "./ComparatorReport";
import DailyReport from "./DailyReport";
import Inspector from "./Inspector";
import { ProductPriceChart } from "./ProductPriceChart";
import { Products } from "./Products";

export default function Layout() {
  return (
    <div className="layout">
      <main>
        <ComparatorReport comparator="Idealo" />
        <DailyReport />
        <ProductPriceChart />
        <Inspector />
        <Products />
      </main>
    </div>
  );
}
