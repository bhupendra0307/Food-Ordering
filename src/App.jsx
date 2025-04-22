import Cart from "./components/Cart.jsx";
import Header from "./components/Header.jsx";
import Meals from "./components/Meals.jsx";
import Checkout from "./components/Checkout.jsx";

import { CartContextProvider } from "./store/CartContext.jsx";
import { UserProgressContextProvider } from "./store/UserProgressContext.jsx";

function App() {
  return (
    // Old

    <UserProgressContextProvider>
      <CartContextProvider>
        <Header />
        <Meals />
        <Cart />
        <Checkout />
      </CartContextProvider>
    </UserProgressContextProvider>

    // Add new
    // <UserProgressContextProvider>
    //   <CartContextProvider>
    //     {/* ✅ Pass orderPlaced and onShowHistory */}
    //     <Header onShowHistory={handleShowHistory} orderPlaced={orderPlaced} />
    //     {!showHistory && <Meals />}
    //     {!showHistory && <Cart />}
    //     {!showHistory && <Checkout onOrderSubmit={handleOrderSubmit} />}{" "}
    //     {/* ✅ Pass onOrderSubmit */}
    //     {showHistory && <History onClose={handleCloseHistory} />}
    //   </CartContextProvider>
    // </UserProgressContextProvider>
  );
}
export default App;
