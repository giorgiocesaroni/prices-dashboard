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
  SelectedComparatorAtom,
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
  const [, setProductHistoricalData] = useRecoilState(ProductHistoricalData);
  const [, setSelectedShops] = useRecoilState(SelectedShopsAtom);
  const resetSelectedShops = useResetRecoilState(SelectedShopsAtom);
  const [selectedProduct] = useRecoilState(SelectedProductAtom);
  const [, setAvailableShops] = useRecoilState(AvailableShopsAtom);
  const [, setAvailableProducts] = useRecoilState(AvailableProductsAtom);
  const [, setLastUpdate] = useRecoilState(LastUpdateAtom);
  const [selectedComparator] = useRecoilState(SelectedComparatorAtom);

  useEffect(() => {
    const productsRef = collection(db, "Products");
    const stop = onSnapshot(productsRef, (snap) =>
      setAvailableProducts(snap.docs.map((d) => d.id))
    );

    return stop;
  }, []);

  useEffect(() => {
    const productsRef = collection(db, "Products");
    const _availableProducts = [];

    const stop = onSnapshot(productsRef, async (snap) => {
      for (let _doc of snap.docs) {
        let path = _doc.ref.path;
        let name = _doc.id;

        let product = { name };

        await getDoc(doc(db, path, "Comparators", selectedComparator)).then(
          (snap) => {
            if (snap.exists()) {
              product = { ...product, ...snap.data() };
              console.log({ product });
            }
          }
        );

        console.log({ product });
        _availableProducts.push(product);
      }

      console.log({ _availableProducts });
      setAvailableProducts(_availableProducts);
    });

    return stop;
  }, [selectedComparator]);

  useEffect(() => {
    resetSelectedShops();

    const comparatorRef = doc(
      db,
      `Products/${selectedProduct}/Comparators/${selectedComparator}`
    );

    getDoc(comparatorRef).then((snap) =>
      setLastUpdate(snap.data?.()?.["last_update"])
    );

    const shopsRef = collection(
      db,
      `Products/${selectedProduct}/Comparators/${selectedComparator}/Shops`
    );
    const stop = onSnapshot(shopsRef, (snap) => {
      const result = {};
      const _availableShops = [];

      snap.docs.forEach((d, i) => {
        const shopName = d.id;
        result[shopName] = {
          ...d.data(),
          color: appleColors[d.data().standing % appleColors.length],
        };

        _availableShops.push({ shopName, ...d.data() });
      });

      setProductHistoricalData(result);

      setAvailableShops(
        _availableShops
          .sort((a, b) => a.standing - b.standing)
          .map((e, i) => ({ ...e, color: appleColors[i % appleColors.length] }))
      );

      setSelectedShops(_availableShops.slice(0, 10).map((s) => s.shopName));
    });

    return stop;
  }, [selectedProduct]);

  return children;
}
