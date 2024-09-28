// atoms.ts
import { atom } from "recoil";

export const researchIdState = atom<string>({
  key: "researchIdState",
  default: "",
});