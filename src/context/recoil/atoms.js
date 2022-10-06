import { atom } from "recoil";

const SelectedProductAtom = atom({
  key: "SelectedProduct",
  default: null,
});

const SelectedShopsAtom = atom({
  key: "SelectedShops",
  default: [],
});

const ProductHistoricalData = atom({
  key: "ProductHistorical",
  default: null,
});

const AvailableShopsAtom = atom({
  key: "AvailableShops",
  default: null,
});

const LastUpdateAtom = atom({
  key: "LastUpdate",
  default: null,
});

const AvailableProductsAtom = atom({
  key: "AvailableProducts",
  default: null,
});

export {
  SelectedProductAtom,
  SelectedShopsAtom,
  ProductHistoricalData,
  AvailableShopsAtom,
  AvailableProductsAtom,
  LastUpdateAtom
};
