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
  const [searchProperties, setSearchProperties] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(availableProducts);

  useEffect(() => {
    if (!searchValue) return setFilteredProducts(availableProducts);

    setFilteredProducts(
      availableProducts.filter((p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, availableProducts]);

  useEffect(() => {
    if (!searchProperties.length) return setFilteredProducts(availableProducts);

    const _filteredProducts = [];

    // Filter by multiple filters
    if (availableProducts) {
      for (let product of availableProducts) {
        const outcomes = searchProperties.map((property) => product[property]);
        // If product answers all the search properties
        if (outcomes.some((e) => e)) {
          _filteredProducts.push(product);
        }
      }
    }

    setFilteredProducts(_filteredProducts);
  }, [searchProperties, availableProducts]);

  function handleSearchProperties(property) {
    setSearchProperties((prev) => {
      if (!prev.includes(property)) {
        return [...prev, property];
      } else {
        return prev.filter((e) => e !== property);
      }
    });
  }

  return (
    <Accordion title="Products" className="products">
      <div className="grid">
        <div className="grid">
          <h4>Filters</h4>
          <div className="flex" style={{ flexWrap: "wrap", gap: ".5rem" }}>
            <p
              onClick={() => handleSearchProperties("online")}
              className={`selectable stats ${
                !searchProperties.includes("online") ? " selected" : ""
              }`}
            >
              🚫 Offline ({availableProducts?.filter((e) => !e.online).length})
            </p>

            <p
              onClick={() => handleSearchProperties("overtaken")}
              className={`selectable stats ${
                searchProperties.includes("overtaken") ? " selected" : ""
              }`}
            >
              ⚠️ Overtaken (
              {availableProducts?.filter((e) => e.overtaken).length})
            </p>

            <p
              onClick={() => handleSearchProperties("winning")}
              className={`selectable stats ${
                searchProperties.includes("winning") ? " selected" : ""
              }`}
            >
              🏆 Winning ({availableProducts?.filter((e) => e.winning).length})
            </p>

            <p
              onClick={() => handleSearchProperties("optimizable")}
              className={`selectable stats ${
                searchProperties.includes("optimizable") ? " selected" : ""
              }`}
            >
              ℹ️ Optimizable (
              {availableProducts?.filter((e) => e.optimizable).length})
            </p>

            <p
              onClick={() => handleSearchProperties("opportunity")}
              className={`selectable stats ${
                searchProperties.includes("opportunity") ? " selected" : ""
              }`}
            >
              💡 Opportunity (
              {availableProducts?.filter((e) => e.opportunity).length})
            </p>
          </div>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-bar"
            placeholder="Search products"
            style={{ width: "100%" }}
          />
        </div>

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
              {!p.online && <p className="stats">🚫</p>}
              {p.overtaken && <p className="stats">⚠️</p>}
              {p.winning && <p className="stats">🏆</p>}
              {p.optimizable && <p className="stats">ℹ️</p>}
              {p.opportunity && <p className="stats">💡</p>}
            </div>
          ))}
        </div>
      </div>
    </Accordion>
  );
}
