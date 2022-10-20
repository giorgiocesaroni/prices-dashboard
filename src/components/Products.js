import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  AvailableProductsAtom,
  SelectedProductAtom,
} from "../context/recoil/atoms";
import Accordion from "./Accordion";

export function Products() {
  const [availableProducts] = useRecoilState(AvailableProductsAtom);
  console.log({ availableProducts });
  const [selectedProduct, setSelectedProduct] =
    useRecoilState(SelectedProductAtom);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!searchValue) return setFilteredProducts(availableProducts);

    setFilteredProducts(
      availableProducts.filter((p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase())
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
        {filteredProducts?.map((p, i) => (
          <div className="flex" style={{ gap: ".5rem" }}>
            <div
              style={{ flex: 1 }}
              key={`product${i}`}
              onClick={() => setSelectedProduct(p.name)}
              className={`flex selectable ${
                selectedProduct === p.name ? "selected" : ""
              }`}
            >
              <p>{p.name}</p>
            </div>
            {p.overtaken && <p className="stats">⚠️</p>}
            {p.optimizable && <p className="stats">ℹ️</p>}
            {p.winning && <p className="stats">🏆</p>}
          </div>
        ))}
      </div>
    </Accordion>
  );
}
