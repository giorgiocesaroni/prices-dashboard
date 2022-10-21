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
  const [searchProperties, setSearchProperties] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(availableProducts);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!searchValue) return setFilteredProducts(availableProducts);
    setFilteredProducts(
      availableProducts.filter((p) =>
        p.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, availableProducts]);

  useEffect(() => {
    if (!searchProperties) return setFilteredProducts(availableProducts);
    setFilteredProducts(availableProducts.filter((p) => p?.[searchProperties]));
  }, [searchProperties, availableProducts]);

  function handleSearchProperties(property) {
    // let _searchProperties = searchProperties;
    // if (_searchProperties.includes(property)) {
    //   return setSearchProperties(
    //     _searchProperties.filter((e) => e !== property)
    //   );
    // }

    // _searchProperties.push(property);
    // setSearchProperties(_searchProperties);
    if (property === searchProperties) return setSearchProperties(null);

    setSearchProperties(property);
  }

  return (
    <Accordion title="Products" className="products">
      <div className="grid">
        <div className="grid">
          <h4>Filters</h4>
          <div className="flex" style={{ flexWrap: "wrap", gap: ".5rem" }}>
            <p
              onClick={() => handleSearchProperties("overtaken")}
              className={`selectable stats ${
                searchProperties === "overtaken" ? " selected" : ""
              }`}
            >
              ⚠️ Overtaken
            </p>
            <p
              onClick={() => handleSearchProperties("winning")}
              className={`selectable stats ${
                searchProperties === "winning" ? " selected" : ""
              }`}
            >
              🏆 Winning
            </p>
            <p
              onClick={() => handleSearchProperties("optimizable")}
              className={`selectable stats ${
                searchProperties === "optimizable" ? " selected" : ""
              }`}
            >
              ℹ️ Optimizable
            </p>
            <p
              onClick={() => handleSearchProperties("opportunity")}
              className={`selectable stats ${
                searchProperties === "opportunity" ? " selected" : ""
              }`}
            >
              💡 Opportunity
            </p>
            <p
              onClick={() => handleSearchProperties("disappeared")}
              className={`selectable stats ${
                searchProperties === "disappeared" ? " selected" : ""
              }`}
            >
              🚫 Disappeared
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
              {p.disappeared && <p className="stats">🚫</p>}
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
