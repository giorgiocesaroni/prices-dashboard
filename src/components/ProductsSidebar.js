import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { db } from "../config/Firebase";
import { SelectedProductAtom } from "../context/recoil/atoms";

export function ProductsSidebar() {
  const [productNames, setProductNames] = useState([]);
  const [selectedProduct, setSelectedProduct] =
    useRecoilState(SelectedProductAtom);

  useEffect(() => {
    const productsRef = collection(db, "products");
    const stop = onSnapshot(productsRef, getProductNames);
    return () => stop();
  }, []);

  function getProductNames(collection) {
    setProductNames(collection.docs.map(d => d.id));
  }

  function handleClick(product) {
    if (selectedProduct === product) {
      return setSelectedProduct(null);
    }

    setSelectedProduct(product);
  }

  return (
    <div className="card products-sidebar">
      <h3>Products</h3>
      {productNames.map(p => (
        <button
          className={`selectable ${selectedProduct === p ? "selected" : ""}`}
          key={p}
          onClick={() => handleClick(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
