import { createStore } from "polotno/model/store";
import { setAnimationsEnabled } from "polotno/config";

// подключаем анимации
setAnimationsEnabled(true);

// создаем стор
export const store = createStore({
  key: process.env.NEXT_PUBLIC_POLOTNO_KEY!,
  showCredit: true,
});
