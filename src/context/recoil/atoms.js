import { atom } from "recoil";

const SelectedProductAtom = atom({
  key: "SelectedProduct",
  default: null,
});

const SelectedShopAtom = atom({
  key: "SelectedShop",
  default: null,
});

const ProductDataAtom = atom({
  key: "ProductData",
  default: null,
});

export { SelectedProductAtom, SelectedShopAtom, ProductDataAtom };
