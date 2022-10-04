import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { db } from "../config/Firebase";
import { SelectedProductAtom, SelectedShopAtom } from "../context/recoil/atoms";

export default function Inspector() {
  return (
    <div className="card inspector">
      <h3>Inspector</h3>
      <Notifications />
      <Rankings />
    </div>
  );
}

function Notifications() {
  return <div className="notifications">Notifications</div>;
}

function Rankings() {
  const selectedProduct = useRecoilValue(SelectedProductAtom);
  const [selectedShop, setSelectedShop] = useRecoilState(SelectedShopAtom);
  const [productShops, setProductShops] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      const productRef = collection(db, "products", selectedProduct, "idealo");
      const stop = onSnapshot(productRef, snap => {
        setProductShops(
          Array.from(new Set(snap.docs.map(d => d.data()["shop_name"])))
        );
      });

      return stop;
    } else {
      setProductShops(null);
    }
  }, [selectedProduct]);

  return (
    <div className="shops">
      Rankings
      {productShops?.map(s => (
        <button
          className={`selectable ${selectedShop === s ? "selected" : ""}`}
          onClick={() => setSelectedShop(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
