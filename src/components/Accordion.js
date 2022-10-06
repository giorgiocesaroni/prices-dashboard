import React, { useState } from "react";

export default function Accordion({ title, children, className = "" }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`card accordion ${className}`}>
      <div
        className="accordion-title"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "2rem",
          marginBottom: open ? "1rem" : "",
        }}
      >
        <h3>{title}</h3>
        <div
          style={{
            height: "10px",
            width: "25px",
            borderRadius: ".5rem",
            background: "#bbb",
            opacity: open ? 0.5 : 1,
          }}
        ></div>
      </div>
      {open && children}
    </div>
  );
}
