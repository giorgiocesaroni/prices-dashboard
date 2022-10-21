import * as d3 from "d3";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

import { eachDayOfInterval } from "date-fns/esm";
import useMeasure from "react-use-measure";

const today = new Date();
const defaultDomain = {
  x: [today, today],
  y: [0, 100],
};

export function LineChart({
  title,
  xLabel,
  yLabel,
  lines,
  width = "100%",
  height = 250,
  domain,
}) {
  domain = domain ?? defaultDomain;

  const [selectedDate, setSelectedDate] = useState([]);

  const [minX, setMinX] = useState(domain.x[0]);
  const [maxX, setMaxX] = useState(domain.x[1]);

  const [minY, setMinY] = useState(domain.y[0]);
  const [maxY, setMaxY] = useState(domain.y[1]);

  let [ref, bounds] = useMeasure();
  let _width = bounds.width;
  let _height = bounds.height;

  useEffect(() => {
    setMinX(domain.x[0]);
    setMaxX(domain.x[1]);

    setMinY(domain.y[0]);
    setMaxY(domain.y[1]);
  }, [domain]);

  let margin = {
    top: 32,
    right: 32,
    bottom: 32,
    left: 32,
  };

  let xScale = d3
    .scaleTime()
    .domain([minX, maxX])
    .range([margin.left, _width - margin.right]);

  let xTicks = xScale.ticks(4);

  let daysInInterval = eachDayOfInterval({ start: minX, end: maxX });

  if (daysInInterval.length > 3) {
    xTicks = daysInInterval;
  }

  let yScale = d3
    .scaleLinear()
    .domain([minY, maxY])
    .range([_height - margin.bottom, margin.top]);

  // Inverting the y axis
  let line = d3
    .line()
    .defined((d) => d[yLabel])
    .x((d) => xScale(new Date(d[xLabel])))
    .y((d) => yScale(d[yLabel]));

  lines = lines.map((l) => ({
    color: l.color,
    line: line(l.data),
  }));

  return (
    <div ref={ref} className="line-chart" style={{ width, height }}>
      <svg
        // onMouseLeave={() => setSelectedDate([])}
        className="chart-inner"
        viewBox={`0 0 ${_width} ${_height}`}
      >
        {lines?.map((l, i) => (
          <path d={l.line} fill="none" stroke={l.color} strokeWidth={2} />
        ))}

        {yScale.ticks(4).map((price, i) => (
          <g key={`yTick${i}`} transform={`translate(0, ${yScale(price)})`}>
            {lines.map((l) => (
              <line
                x1={margin.left}
                x2={_width}
                stroke="#999"
                strokeWidth={0.5}
                strokeDasharray="1,3"
              />
            ))}
            <text alignmentBaseline="middle" fill="#999" fontSize={10}>
              {price}
            </text>
          </g>
        ))}

        {xTicks.map((date, i) => (
          <g transform={`translate(${xScale(date)}, 0)`}>
            {/* <rect
              width={xScale(addDays(date, 1)) - xScale(date)}
              height={_height}
              opacity={selectedDate.includes(i) ? 0.05 : 0}
              // onMouseDown={(e) => {
              //   setSelectedDate([i]);
              // }}
              // onMouseEnter={(e) => {
              //   if (e.buttons) {
              //     setSelectedDate((prev) => prev.concat(i));
              //   }
              // }}
              // onMouseUp={() => {
              //   setMinX(xTicks.at(selectedDate[0]));
              //   setMaxX(addDays(xTicks.at(selectedDate.at(-1)), 1));
              //   setSelectedDate([]);
              // }}
            /> */}
            <text
              y={_height}
              alignmentBaseline="bottom"
              fill="#999"
              fontSize={10}
            >
              {formatDateTicks(date)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function formatDateTicks(date) {
  if (date.getDate() === 1) {
    return format(date, "MMM");
  }

  if (date.getHours() === 0) {
    return format(date, "d/M");
  }

  return format(date, "H:mm");
}
