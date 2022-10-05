import * as d3 from "d3";
import { addDays, format, parse } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns/esm";
import { useRecoilValue } from "recoil";
import { ProductDataAtom } from "./context/recoil/atoms";

export function LineChart() {
  const [data, setData] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("Amazon.it");
  const [ticks, setTicks] = useState([]);
  const innerRef = useRef(null);

  const productData = useRecoilValue(ProductDataAtom);

  let [ref, bounds] = useMeasure();
  let width = bounds.width;
  let height = bounds.height;
  console.log({ width, height });

  useEffect(() => {
    const _data = productData;
    if (!productData) return;

    console.log({ productData });

    const _shops = Array.from(new Set(_data?.map(e => e["shop_name"]))).sort();
    setShops(_shops);

    const _analyzed_days = [];
    const _ticks = [];

    let result = {};
    for (let entry of _data) {
      if (!_analyzed_days.includes(entry.date.slice(0, 10))) {
        _analyzed_days.push(entry.date.slice(0, 10));
        _ticks.push(entry.date);
      }

      if (entry.date in result) {
        result[entry.date][entry.shop_name] = entry.price_with_shipping;
      } else {
        result[entry.date] = {
          date: entry.date,
          [entry.shop_name]: entry.price_with_shipping,
        };
      }
    }

    setTicks(_ticks);
    result = Object.values(result);
    setData(result);
  }, [productData]);

  if (!data?.length) return;

  return (
    <div
      ref={ref}
      className="line-chart"
      style={{
        maxWidth: "100%",
        height: "500px",
        maxHeight: "75vh",
        overflow: "hidden",
      }}
    >
      <ChartInner
        // ref={ref}
        selectedShop={selectedShop}
        data={data}
        width={width}
        height={height}
      />
    </div>
  );
}

function ChartInner({ data, selectedShop, width, height }) {
  const _parseDate = date => parse(date, "yyyy-MM-dd'T'HH-mm", new Date());

  const [selectedDate, setSelectedDate] = useState([]);

  data = data
    .slice(50, data.length - 1)
    .map(e => [_parseDate(e.date), parseFloat(e[selectedShop])])
    .sort((a, b) => a[0].getTime() - b[0].getTime());

  const [startDay, setStartDay] = useState(startOfMonth(data.at(0)[0]));
  const [endDay, setEndDay] = useState(endOfMonth(data.at(-1)[0]));

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
    .domain(d3.extent(data.map(d => d[1])))
    .range([height - margin.bottom, margin.top]);

  // Inverting the y axis
  let line = d3
    .line()
    .defined(d => !isNaN(d[1]))
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));
  let d = line(data);

  return (
    <svg
      style={{
        maxWidth: "100%",
      }}
      onMouseLeave={() => setSelectedDate([])}
      className="chart-inner"
      viewBox={`0 0 ${width} ${height}`}
    >
      <path d={d} fill="none" stroke="rgb(0, 122, 255)" strokeWidth={2}></path>

      {/* Y Axis */}
      {yScale.ticks().map(price => (
        <g transform={`translate(0, ${yScale(price)})`}>
          <line
            x1={margin.left}
            x2={width - margin.right}
            stroke="#999"
            strokeWidth={0.5}
            strokeDasharray="1,3"
          />
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
