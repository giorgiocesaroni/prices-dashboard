import { useRecoilState } from "recoil";
import {
  AvailableProductsAtom,
  SelectedProductAtom,
} from "../context/recoil/atoms";

export function ProductsSidebar() {
  const [availableProducts] = useRecoilState(AvailableProductsAtom);
  const [selectedProduct, setSelectedProduct] =
    useRecoilState(SelectedProductAtom);

  console.log({ availableProducts });

  return (
    <div
      className="card products-sidebar"
      style={{ display: "grid", gap: ".5rem" }}
    >
      <h3>Products</h3>
      {availableProducts?.map(p => (
        <button
          onClick={() => setSelectedProduct(p)}
          className={`selectable ${selectedProduct === p ? "selected" : ""}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
