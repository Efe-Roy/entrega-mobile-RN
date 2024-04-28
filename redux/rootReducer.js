import authSlice from "./features/authSlice";
import basketSlice from "./features/basketSlice";
import navSlice from "./features/navSlice";

const rootReducer = {
  basket: basketSlice,
  nav: navSlice,
  auth: authSlice,
};

export default rootReducer;
