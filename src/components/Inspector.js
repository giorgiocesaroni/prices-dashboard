import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  AvailableShopsAtom,
  LastUpdateAtom,
  SelectedShopsAtom,
} from "../context/recoil/atoms";
import Accordion from "./Accordion";

export default function Inspector() {
  return (
    <Accordion title="Inspector" className="card inspector">
      {/* <Notifications /> */}
      <LastUpdate />
      <Rankings />
    </Accordion>
  );
}

function Notifications() {
  return <div className="notifications">Notifications</div>;
}

function LastUpdate() {
  const lastUpdate = useRecoilValue(LastUpdateAtom);

  if (!lastUpdate) return;
  return (
    <div className="last-update">
      <h4>Last Update</h4>
      <p>{new Date(lastUpdate).toLocaleString()}</p>
    </div>
  );
}

function Rankings() {
  const availableShops = useRecoilValue(AvailableShopsAtom);
  console.log({ availableShops });
  const [selectedShops, setSelectedShops] = useRecoilState(SelectedShopsAtom);

  function handleClick(shopName) {
    if (selectedShops.includes(shopName)) {
      return setSelectedShops((prev) => prev.filter((s) => s !== shopName));
    }

    setSelectedShops((prev) => [...prev, shopName]);
  }

  return (
    <div className="shops">
      <h4>Rankings</h4>
      {/* Online shops */}
      {availableShops
        ?.filter((s) => s.online)
        .map((s) => (
          <div className="flex">
            <span className="index">{s.standing}</span>
            <p
              onClick={() => handleClick(s)}
              className={`selectable ${
                selectedShops.includes(s) ? "selected" : ""
              }`}
              style={
                selectedShops.includes(s)
                  ? { backgroundColor: s.color, flex: 1 }
                  : { flex: 1 }
              }
            >
              {s.shopName}
            </p>
            <p className="stats">
              {s["price_with_shipping"].toFixed(2).toLocaleString("it-IT")}
            </p>
          </div>
        ))}

      {/* Offline shops */}
      {availableShops
        ?.filter((s) => !s.online)
        .map((s) => (
          <div className="flex" style={{ opacity: 0.5 }}>
            <p
              onClick={() => handleClick(s)}
              className={`selectable ${
                selectedShops.includes(s) ? "selected" : ""
              }`}
              style={
                selectedShops.includes(s)
                  ? { backgroundColor: s.color, flex: 1 }
                  : { flex: 1 }
              }
            >
              {s.shopName}
            </p>
            <p className="stats">
              {s["price_with_shipping"].toFixed(2).toLocaleString("it-IT")}
            </p>
          </div>
        ))}
    </div>
  );
}
