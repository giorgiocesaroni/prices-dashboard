import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/Firebase";
import Accordion from "./Accordion";

// Reports daily sales stats
export default function DailyReport() {
  const [dailyReport, setDailyReport] = useState(null);

  useEffect(() => {
    const dailyReportRef = doc(db, "Reports", "latest_report");
    const stop = onSnapshot(dailyReportRef, (snap) =>
      setDailyReport(snap.data())
    );
    return stop;
  }, []);

  if (!dailyReport) return;
  return (
    <Accordion className="card" title="Daily Report">
      <div className="daily-report">
        <div>
          <h4>Last Update</h4>
          <p className="stats">
            {new Date(dailyReport["last_modification"]).toLocaleString()}
          </p>
        </div>

        <div>
          <h4>Daily Gross Revenue</h4>
          <h5 className="stats">
            {dailyReport["grand_total"].toLocaleString("it-IT")}
          </h5>
        </div>

        <div>
          <h4>Rankings</h4>
          <div style={{ display: "grid", gap: "1rem" }}>
            {dailyReport.rankings.map((r, i) => (
              <div className="stats" style={{ display: "grid", gap: "1rem" }}>
                <div className="stat">
                  <p className="stat-value">{r["product_name"]}</p>
                </div>

                <div className="stat">
                  <p className="stat-label">Average price</p>
                  <p className="stat-value">
                    {r["average_price"].toLocaleString("it-IT")}
                  </p>
                </div>

                <div className="stat">
                  <p className="stat-label">Sales</p>
                  <p className="stat-value">{r["sales"]}</p>
                </div>

                <div className="stat">
                  <p className="stat-label">Sales Total</p>
                  <p className="stat-value">
                    {r["sales_total"].toLocaleString("it-IT")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Accordion>
  );
}
