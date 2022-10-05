import * as d3 from "d3";
import { addDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns/esm";
import { useRecoilValue } from "recoil";
import {
  ProductHistoricalData,
  SelectedShopsAtom,
} from "./context/recoil/atoms";

export function LineChart() {
  const selectedShops = useRecoilValue(SelectedShopsAtom);
  const productHistoricalData = useRecoilValue(ProductHistoricalData);
  const [domain, setDomain] = useState(null);

  let [ref, bounds] = useMeasure();
  let width = bounds.width;
  let height = bounds.height;

  // At load, compute domain
  useEffect(() => {
    if (!selectedShops?.length) return;

    let minPrices = [];
    let maxPrices = [];

    let minDates = [];
    let maxDates = [];

    console.log({ selectedShops, productHistoricalData });
    for (let shop of selectedShops.map(s => productHistoricalData[s])) {
      console.log(shop);
      let _minPrice = Math.min(...shop.historicalData.map(d => d.price));
      let _maxPrice = Math.max(...shop.historicalData.map(d => d.price));

      let _minDate = shop.historicalData
        .map(d => new Date(d.date))
        .sort((a, b) => a.getTime() - b.getTime())
        .at(0);
      let _maxDate = shop.historicalData
        .map(d => new Date(d.date))
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
  }, [selectedShops]);

  console.log({ domain });

  if (!selectedShops?.length) return;
  return (
    <div
      ref={ref}
      className="line-chart"
      style={{
        maxWidth: "100%",
        height: "500px",
        maxHeight: "65vh",
        minHeight: "65vh",
        overflow: "hidden",
      }}
    >
      {domain && (
        <ChartInner
          lines={selectedShops.map(s => ({
            historicalData: productHistoricalData[s].historicalData,
            color: productHistoricalData[s].color,
          }))}
          width={width}
          height={height}
          domain={domain}
        />
      )}
    </div>
  );
}

function ChartInner({ lines, width, height, domain }) {
  console.log({ domain });
  const [selectedDate, setSelectedDate] = useState([]);

  const [minPrice, setMinPrice] = useState(domain.y[0]);
  const [maxPrice, setMaxPrice] = useState(domain.y[1]);

  useEffect(() => {
    setMinPrice(domain.y[0]);
    setMaxPrice(domain.y[1]);
  }, [domain]);

  const [startDay, setStartDay] = useState(domain.x[0]);
  const [endDay, setEndDay] = useState(domain.x[1]);

  console.log({ startDay, endDay });
  console.log({ domain });

  let xTicks = eachDayOfInterval({ start: startDay, end: endDay });

  let margin = {
    top: 32,
    right: 32,
    bottom: 32,
    left: 32,
  };

  let xScale = d3
    .scaleTime()
    .domain([startDay, endDay])
    .range([margin.left, width - margin.right]);

  let yScale = d3
    .scaleLinear()
    .domain([minPrice, maxPrice])
    .range([height - margin.bottom, margin.top]);

  // Inverting the y axis
  let line = d3
    .line()
    .defined(d => d["price"])
    .x(d => xScale(new Date(d["date"])))
    .y(d => yScale(d["price"]));

  console.log(lines);
  lines = lines.map(l => ({ color: l.color, line: line(l["historicalData"]) }));

  return (
    <svg
      style={{
        maxWidth: "100%",
      }}
      onMouseLeave={() => setSelectedDate([])}
      className="chart-inner"
      viewBox={`0 0 ${width} ${height}`}
    >
      {lines?.map(l => (
        <path d={l.line} fill="none" stroke={l.color} strokeWidth={2} />
      ))}

      {yScale.ticks().map(price => (
        <g transform={`translate(0, ${yScale(price)})`}>
          {lines.map(l => (
            <line
              key={l}
              x1={margin.left}
              x2={width}
              stroke="#999"
              strokeWidth={0.5}
              strokeDasharray="1,3"
            />
          ))}
          <text
            alignmentBaseline="middle"
            key={price}
            fill="#999"
            fontSize={10}
          >
            {price}
          </text>
        </g>
      ))}

      {xTicks.map((date, i) => (
        <g transform={`translate(${xScale(date)}, 0)`}>
          <rect
            width={xScale(addDays(date, 1)) - xScale(date)}
            height={height}
            opacity={selectedDate.includes(i) ? 0.05 : 0}
            onMouseDown={e => {
              setSelectedDate([i]);
            }}
            onMouseEnter={e => {
              if (e.buttons) {
                setSelectedDate(prev => prev.concat(i));
              }
            }}
            onMouseUp={() => {
              setStartDay(xTicks.at(selectedDate[0]));
              setEndDay(addDays(xTicks.at(selectedDate.at(-1)), 1));
              setSelectedDate([]);
            }}
          />
          {date.getDate() % 2 === 1 && (
            <text
              y={height}
              alignmentBaseline="bottom"
              key={date}
              fill="#999"
              fontSize={10}
            >
              {date.getDate() === 1 ? format(date, "MMM") : format(date, "d")}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
