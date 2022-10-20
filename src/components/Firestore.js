import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { db } from "../config/Firebase";
import {
  ProductHistoricalData,
  SelectedProductAtom,
  SelectedShopsAtom,
  AvailableShopsAtom,
  AvailableProductsAtom,
  LastUpdateAtom,
} from "../context/recoil/atoms";

const appleColors = [
  "rgb(255, 59, 48)",
  "rgb(255, 149, 0)",
  "rgb(255, 204, 0)",
  "rgb(52, 199, 89)",
  "rgb(0, 199, 190)",
  "rgb(48, 176, 199)",
  "rgb(50, 173, 230)",
  "rgb(0, 122, 255)",
  "rgb(88, 86, 214)",
  "rgb(175, 82, 222)",
  "rgb(255, 45, 85)",
  "rgb(162, 132, 94)",
];

export default function Firestore({ children }) {
  const [productHistoricalData, setProductHistoricalData] = useRecoilState(
    ProductHistoricalData
  );
  const [selectedShops, setSelectedShops] = useRecoilState(SelectedShopsAtom);
  const resetSelectedShops = useResetRecoilState(SelectedShopsAtom);
  const [selectedProduct] = useRecoilState(SelectedProductAtom);
  const [, setAvailableShops] = useRecoilState(AvailableShopsAtom);
  const [availableProducts, setAvailableProducts] = useRecoilState(
    AvailableProductsAtom
  );
  const [lastUpdate, setLastUpdate] = useRecoilState(LastUpdateAtom);

  useEffect(() => {
    const productsRef = collection(db, "Products");
    const stop = onSnapshot(productsRef, (snap) =>
      setAvailableProducts(snap.docs.map((d) => d.id))
    );

    return stop;
  }, []);

  useEffect(() => {
    resetSelectedShops();

    const comparatorRef = doc(
      db,
      `Products/${selectedProduct}/Comparators/Idealo`
    );
    getDoc(comparatorRef).then((snap) =>
      setLastUpdate(snap.data?.()?.["last_update"])
    );

    const shopsRef = collection(
      db,
      `Products/${selectedProduct}/Comparators/Idealo/Shops`
    );
    const stop = onSnapshot(shopsRef, (snap) => {
      const result = {};
      const _availableShops = [];

      snap.docs.forEach((d, i) => {
        const shopName = d.id;
        const historicalData = d.data()["historical_data"];
        const color = appleColors[i % appleColors.length];
        result[shopName] = {
          historicalData,
          color,
        };

        _availableShops.push({ shopName, color });
      });
      setProductHistoricalData(result);

      setAvailableShops(_availableShops);
      setSelectedShops(_availableShops.slice(0, 10).map((s) => s.shopName));
    });

    return stop;
  }, [selectedProduct]);

  return children;
}
