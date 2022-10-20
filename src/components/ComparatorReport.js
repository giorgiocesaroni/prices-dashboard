import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/Firebase";
import Accordion from "./Accordion";
import { LineChart } from "./LineChart";

// Reports general stats over our presence on a comparator
export default function ComparatorReport({ comparator }) {
  const [comparatorReport, setComparatorReport] = useState(null);

  useEffect(() => {
    const comparatorReportRef = doc(
      db,
      "Reports",
      comparator,
      "historical_data",
      "2022-10" // change with this_month
    );

    return onSnapshot(comparatorReportRef, (snap) => {
      setComparatorReport(snap.data());
    });
  }, []);

  if (!comparatorReport) return;
  return (
    <Accordion title={`${comparator} Report`}>
      <div className="grid gap-2">
        <div className="module">
          <h4>Dominance</h4>
          <LineChart
            title="Idealo Dominance"
            xLabel="date"
            yLabel="dominance"
            lines={[
              {
                data: comparatorReport.dominance,
                color: "rgb(0, 122, 255)",
              },
            ]}
            height={150}
            domain={{
              x: [
                new Date(comparatorReport.dominance.at(0).date),
                new Date(comparatorReport.dominance.at(-1).date),
              ],
              y: [
                Math.min(...comparatorReport.dominance.map((e) => e.dominance)),
                Math.max(...comparatorReport.dominance.map((e) => e.dominance)),
              ],
            }}
          />
        </div>

        <div className="module">
          <h4>Avg. Profit Margin</h4>
          <LineChart
            title="Idealo Average Profit Margin"
            xLabel="date"
            yLabel="average_profit_margin"
            lines={[
              {
                data: comparatorReport["average_margin"],
                color: "rgb(0, 122, 255)",
              },
            ]}
            height={150}
            domain={{
              x: [
                new Date(comparatorReport["average_margin"].at(0).date),
                new Date(comparatorReport["average_margin"].at(-1).date),
              ],
              y: [
                Math.min(
                  ...comparatorReport["average_margin"].map(
                    (e) => e["average_profit_margin"]
                  )
                ),
                Math.max(
                  ...comparatorReport["average_margin"].map(
                    (e) => e["average_profit_margin"]
                  )
                ),
              ],
            }}
          />
        </div>
      </div>
    </Accordion>
  );
}
