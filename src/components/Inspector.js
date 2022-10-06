import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { AvailableShopsAtom, LastUpdateAtom, SelectedShopsAtom } from "../context/recoil/atoms";

export default function Inspector() {
  return (
    <div className="card inspector">
      <h3>Inspector</h3>
      {/* <Notifications /> */}
      <LastUpdate />
      <Rankings />
    </div>
  );
}

function Notifications() {
  return <div className="notifications">Notifications</div>;
}

function LastUpdate() {
  const lastUpdate = useRecoilValue(LastUpdateAtom);
  console.log(lastUpdate, Date.parse(lastUpdate))

  if (!lastUpdate) return;
  return (
      <div className="last-update">
        <h4>
          Last Update
        </h4>
        <p>{new Date(lastUpdate).toLocaleString()}</p>
      </div>
  )
}

function Rankings() {
  const availableShops = useRecoilValue(AvailableShopsAtom);
  const [selectedShops, setSelectedShops] = useRecoilState(SelectedShopsAtom);

  function handleClick(shop) {
    if (selectedShops.includes(shop)) {
      return setSelectedShops(prev => prev.filter(s => s !== shop));
    }

    setSelectedShops(prev => [...prev, shop]);
  }

  return (
    <div className="shops">
      <h4>Rankings</h4>
      {availableShops?.map(s => (
        <button
          onClick={() => handleClick(s.shopName)}
          className={`selectable ${
            selectedShops.includes(s.shopName) ? "selected" : ""
          }`}
          style={
            selectedShops.includes(s.shopName)
              ? { backgroundColor: s.color }
              : {}
          }
        >
          {s.shopName}
        </button>
      ))}
    </div>
  );
}
