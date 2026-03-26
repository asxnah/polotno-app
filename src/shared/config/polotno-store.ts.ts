import { createStore } from "polotno/model/store";

export const store = createStore({
  key: process.env.NEXT_PUBLIC_POLOTNO_KEY!,
  showCredit: true,
});
