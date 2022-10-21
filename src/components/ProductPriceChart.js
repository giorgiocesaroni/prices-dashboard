import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  ProductHistoricalData,
  SelectedShopsAtom,
} from "../context/recoil/atoms";
import Accordion from "./Accordion";
import { LineChart } from "./LineChart";

export function ProductPriceChart() {
  const selectedShops = useRecoilValue(SelectedShopsAtom);
  const productHistoricalData = useRecoilValue(ProductHistoricalData);
  const [domain, setDomain] = useState(null);

  // At load, compute domain
  useEffect(() => {
    if (!selectedShops?.length) return;

    let minPrices = [];
    let maxPrices = [];

    let minDates = [];
    let maxDates = [];

    for (let shop of selectedShops.map((s) => productHistoricalData[s])) {
      let _minPrice = Math.min(...shop["historical_data"].map((d) => d.price));
      let _maxPrice = Math.max(...shop["historical_data"].map((d) => d.price));

      let _minDate = shop["historical_data"]
        .map((d) => new Date(d.date))
        .sort((a, b) => a.getTime() - b.getTime())
        .at(0);
      let _maxDate = shop["historical_data"]
        .map((d) => new Date(d.date))
        .sort((a, b) => a.getTime() - b.getTime())
        .at(-1);

      minPrices.push(_minPrice);
      maxPrices.push(_maxPrice);

      minDates.push(_minDate);
      maxDates.push(_maxDate);
    }

    let minPrice = Math.min(...minPrices);
    let maxPrice = Math.max(...maxPrices);

    let minDate = minDates.sort((a, b) => a.getTime() - b.getTime()).at(0);
    let maxDate = maxDates.sort((a, b) => a.getTime() - b.getTime()).at(-1);

    setDomain({ x: [minDate, maxDate], y: [minPrice, maxPrice] });
  }, [selectedShops, productHistoricalData]);

  return (
    <Accordion title="Graph">
      <LineChart
        title="Product Price"
        xLabel="date"
        yLabel="price"
        lines={selectedShops.map((s) => ({
          data: productHistoricalData[s]["historical_data"],
          color: productHistoricalData[s].color,
        }))}
        domain={domain}
      />
    </Accordion>
  );
}
