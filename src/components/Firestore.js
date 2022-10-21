import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { db } from "../config/Firebase";
import {
  AvailableProductsAtom,
  AvailableShopsAtom,
  LastUpdateAtom,
  ProductHistoricalData,
  SelectedComparatorAtom,
  SelectedProductAtom,
  SelectedShopsAtom,
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
    const comparators = collectionGroup(db, "Comparators");

    return onSnapshot(comparators, (snap) => {
      let availableProducts = [];

      snap.docs.forEach((doc) => {
        let data = doc.data();
        let parentProduct = doc.ref.parent.parent.id;

        availableProducts.push({ name: parentProduct, ...data });
      });

      setAvailableProducts(availableProducts);
    });
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
      let _availableShops = [];

      snap.docs.forEach((d, i) => {
        const shopName = d.id;
        result[shopName] = {
          ...d.data(),
          color: appleColors[d.data().standing - 1 % appleColors.length],
        };

        _availableShops.push({ shopName, ...d.data() });
      });

      setProductHistoricalData(result);

      _availableShops = _availableShops
        .sort((a, b) => a.standing - b.standing)
        .map((e, i) => ({ ...e, color: appleColors[e.standing - 1 % appleColors.length] }));

      setAvailableShops(_availableShops);
      setSelectedShops(_availableShops.slice(0, 10));
    });

    return stop;
  }, [selectedProduct]);

  return children;
}
