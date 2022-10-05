import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  AvailableProductsAtom,
  SelectedProductAtom,
} from "../context/recoil/atoms";

export function ProductsSidebar() {
  const [availableProducts] = useRecoilState(AvailableProductsAtom);
  const [selectedProduct, setSelectedProduct] =
    useRecoilState(SelectedProductAtom);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setFilteredProducts(null);
    if (!searchValue) return;

    setFilteredProducts(
      availableProducts.filter(p =>
        p.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <div
      className="card products-sidebar"
      style={{ display: "grid", gap: ".5rem", minWidth: "20rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Products</h3>
        <div
          onClick={() => setOpen(prev => !prev)}
          style={{
            height: "10px",
            width: "25px",
            borderRadius: ".5rem",
            background: "#bbb",
            opacity: open ? 0.5 : 1,
          }}
        ></div>
      </div>
      {open && (
        <>
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="search-bar"
            placeholder="Search products"
          />
          {filteredProducts?.map(p => (
            <button
              onClick={() => setSelectedProduct(p)}
              className={`selectable ${
                selectedProduct === p ? "selected" : ""
              }`}
            >
              {p}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
