import React, { useState } from "react";
import RestaurantMenuItems from "./RestaurantMenuItems";
import "./RestaurantMenu.css";
import { Container, Row, Col } from "react-bootstrap";
import { AddToCart } from "./buttons/AddToCart";
import { RemoveCartItems } from "./buttons/RemoveCartItems";
import tw from "twin.macro";
import { BillingButton } from "./buttons/BillingButton";
import { Form } from "react-bootstrap";

const Card = tw.div`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0 shadow-lg p-2`;


function RestaurantMenu() {
  const [cart, setCart] = useState(RestaurantMenuItems);

  const addToCart = i => {
    setCart(prevState =>
      prevState.map((item, o) => {
        if (i === o) {
          return {
            ...item,
            inCart: true,
            count: item.counterVal
          };
        }
        return item;
      })
    );
  };

  const increaseQuantity = i => {
    setCart(prevCart =>
      prevCart.map((item, o) => {
        if (i === o && item.inCart) {
          if (item.count > 9) {
            return item;
          } else return { ...item, count: item.count + 1 };
        } else if (i === o) {
          if (item.counterVal > 9) {
            return item;
          } else
            return {
              ...item,
              counterVal: item.counterVal + 1
            };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = i => {
    setCart(prevCart =>
      prevCart.map((item, o) => {
        if (i === o && item.inCart) {
          if (item.count > 1) {
            return { ...item, count: item.count - 1 };
          } else {
            return item;
          }
        } else if (i === o && item.counterVal > 1) {
          return {
            ...item,
            counterVal: item.counterVal - 1
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = i => {
    setCart(prevCart =>
      prevCart.map((item, o) => {
        if (i === o) {
          return {
            ...item,
            count: 0,
            counterVal: 1,
            inCart: false
          };
        }
        return item;
      })
    );
  };

  const cartCountTotal = cart.reduce((acc, item) => acc + item.count, 0);
  const cartPriceTotal = cart.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  const cartTotals = () =>
    cartCountTotal === 0 ? (
      <b>Cart is empty</b>
    ) : (
      <>
        <b>
          <p>Items in Cart: {cartCountTotal}</p>
          <p>
            Total Price: Rs-
            {Number.isInteger(cartPriceTotal)
              ? cartPriceTotal
              : cartPriceTotal.toFixed(2)}
          </p>
          <BillingButton buttonSize="billing--btn--medium" buttonStyle="billing--btn--outline" >Proceed for Billing</BillingButton>
        </b>
      </>
    );

  const cartItems = cart.map((item, i) => (
    <React.Fragment  key={item.name}>
      {item.inCart && (
        <>
          <p> Item Name: {item.name}</p>
          <p>
            Item Count: <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => decreaseQuantity(i)}>-</button>{" "}
            {item.count} <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => increaseQuantity(i)}>+</button>
          </p>
          <p>
            Item Subtotal: Rs-
            {Number.isInteger(item.count * item.price)
              ? item.count * item.price
              : `${(item.count * item.price).toFixed(2)}`}
          </p>
          <RemoveCartItems buttonSize="remove--btn--medium" buttonStyle="remove--btn--outline" onClick={() => removeFromCart(i)}>Remove From Cart</RemoveCartItems>
          <hr />
        </>
      )}
    </React.Fragment>
  ));

  const cartProducts = () => (
    <div className="flexParent">
     {cart.filter((item) => {
            if (searchTerm == "") {
              return item
            } else if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return item
            }
          }).map((item, i) => (
        <Card key={i}>
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>{item.restaurantname}</p>
          <p>Price: Rs-{item.price}</p>
          {!item.inCart ? (
            <>
              <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => decreaseQuantity(i)}>-</button>
              <input readOnly type="text" value={item.counterVal} />
              <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => increaseQuantity(i)}>+</button>
              <br />
              <AddToCart buttonSize="cart--btn--medium" buttonStyle="cart--btn--outline" onClick={() => addToCart(i)}>add</AddToCart>
            </>
          ) : (
            <p>
              <b>Item added!</b>
            </p>
          )}
        </Card>
      ))}
    </div>
  );
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Container>
      <h1 style={{fontFamily:"'Montserrat', sans-serif;", margin:"20px 0"}}>Restaurant Name</h1>
      <Form.Control style={{margin:"20px 0"}} type="text" placeholder="Dish name" onChange={event => {setSearchTerm(event.target.value)}} />
      <Container>
        <Row>
            <Col sm={8}>{cartProducts()} </Col>
            <Col sm={4}>
             {cartItems} {cartTotals()}</Col>
        </Row>
        </Container>
      
      
      
      {/*
      {cartTotals()}
      {cartProducts()} */}
    </Container>
  );
}

export default RestaurantMenu;