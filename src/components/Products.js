import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  AvailableProductsAtom,
  SelectedProductAtom,
} from "../context/recoil/atoms";
import Accordion from "./Accordion";

export function Products() {
  const [availableProducts] = useRecoilState(AvailableProductsAtom);
  const [selectedProduct, setSelectedProduct] =
    useRecoilState(SelectedProductAtom);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!searchValue) return setFilteredProducts(availableProducts);

    setFilteredProducts(
      availableProducts.filter((p) =>
        p.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, availableProducts]);

  return (
    <Accordion title="Products" className="products">
      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="search-bar"
        placeholder="Search products"
        style={{ width: "100%" }}
      />
      <div style={{ display: "grid", gap: ".5rem" }}>
        {filteredProducts?.map((p) => (
          <button
            onClick={() => setSelectedProduct(p)}
            className={`selectable ${selectedProduct === p ? "selected" : ""}`}
          >
            {p}
          </button>
        ))}
      </div>
    </Accordion>
  );
}
