import { useContext } from "react";

import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import { currencyFormatter } from "../util/formatting.js";
import Button from "./UI/Button.jsx";
import Input from "./UI/Input.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../hooks/useHttp.jsx";
import Error from "./Error.jsx";

//This object should be created outside of the component functino to avoid infinite loops.
const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries()); // {email: test@gmail.com}
    const totalPrice = cartCtx.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    console.log("Extracted Customer Data:", customerData);
    console.log("Calculated Total Price:", totalPrice);
    // totalPrice: totalPrice,
    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          totalPrice: totalPrice,
          customer: customerData,
        },
      })
    );

    /*    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      }),
    }); */
  }

  // SO i Wanna output these button conditionally

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  // But i then check if isSending is true, and if that's the case, action could instead be a span, which says "Sending order data"
  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Sucess!</h2>
        <p>Your Order was submitted sucessfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street Address" type="text" id="address" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postalCode" />{" "}
          {/* change the id of postal code */}
          <Input label="city" type="text" id="city" />
        </div>
        {/* Output is error message is here if above is something is wrong- we can check if error is true here */}
        {error && <Error title="Failed to submit order" message={error} />}

        {/* Render the button conditionally */}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
