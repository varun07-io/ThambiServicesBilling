import React, { useState } from "react";
import RestaurantMenuItems from "./RestaurantMenuItems";
import "./RestaurantMenu.css";
import { Container, Row, Col } from "react-bootstrap";
import { AddToCart } from "./buttons/AddToCart";
import { Popover } from 'react-tiny-popover'
import { RemoveCartItems } from "./buttons/RemoveCartItems";
import tw from "twin.macro";
import { BillingButton } from "./buttons/BillingButton";
import { Form,Button } from "react-bootstrap";

const Card = tw.div`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0 shadow-lg p-2`;


function RestaurantMenu() {
  const [cart, setCart] = useState(RestaurantMenuItems);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)


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
          <BillingButton onClick={() => setIsPopoverOpen(!isPopoverOpen)} buttonSize="billing--btn--medium" buttonStyle="billing--btn--outline" >Proceed for Billing</BillingButton>
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
              <input className="input_cart" readOnly type="text" value={item.counterVal} />
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
  
  const [orderNumber, setorderNumber] = useState(0);
  const [todaysDate, settodaysDate] = useState(new Date().toISOString().slice(0, 10));
  const [deliveryBoyName, setdeliveryBoyName] = useState('');
  const [contactNumber, setcontactNumber] = useState(0);
  const [pickup, setpickup] = useState('');
  const [drop, setdrop] = useState('');
  const [startandendKm, setstartandendKm] = useState('');
  const [billItem, setbillItem] = useState([]);
  const [billAmout, setbillAmout] = useState(0);
  const [deliveryChange, setdeliveryChange] = useState(0);
  const [otherCharges, setotherCharges] = useState(0);

  return (
    <Container>
      {isPopoverOpen ? (

        <
  
        >
      <h1 style={{fontFamily:"'Montserrat', sans-serif;", margin:"20px 0"}}>Enter Bill Details</h1>

          <Form
        style={{
          marginBottom: 150
        }}
          >
       
            <Row>
              <Col>
              <Form.Group className="mb-3" >
              <Form.Label>Enter the Order Number</Form.Label>
              <Form.Control type="number" placeholder="Enter the order number" />

              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3" >
              <Form.Label>Today's Date</Form.Label>
              <Form.Control type="date" value={todaysDate} placeholder="Today's Date" onChange={(e) => settodaysDate(e.target.value)} />

              </Form.Group>
              </Col>
            </Row>


          


  <Form.Group className="mb-3" >
    <Form.Label>Delivery Boy Name</Form.Label>

    <Form.Select aria-label="Select Delivery Boy Name" onChange={(e) => setdeliveryBoyName(e.target.value)}>
  <option>Select Delivery Boy Name</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</Form.Select>
  </Form.Group>
  <Row>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Enter Customer Name</Form.Label>
              <Form.Control type="text" placeholder="Enter the customer Name" />

              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Enter Customer Phone</Form.Label>
              <Form.Control type="number" placeholder="Enter the customer phone" />

              </Form.Group>
              </Col>
            </Row>
            <div
            style={{
              backgoundColor:'blue'
            }}
            >

                  {cart.map((item, i) => (
    <React.Fragment  key={item.name}>
      {item.inCart && (
        <div
        style={{
            borderWidth:5,
            borderRadius: 12,
            padding:12
        }}
        className="flexParent"
        >
          <p> Item No: {i}</p>
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
        </div>
      )}
    </React.Fragment>
  ))}
              {
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
          <BillingButton onClick={() => setIsPopoverOpen(!isPopoverOpen)} buttonSize="billing--btn--medium" buttonStyle="billing--btn--outline" >Proceed for Billing</BillingButton>
        </b>
      </>
    )}
            </div>
            <div
              style={{
                backgroundColor: '#6AC47E',
                padding:20,
                borderRadius: 10,
                color: 'white',
                marginTop:12,
                marginBottom: 12
              }}
            >
  <Row

  >
              <Col>
              <Form.Group className="mb-3" >
    <Form.Label>Pick-Up Location</Form.Label>

    <Form.Select aria-label="Select Pick-up Location" onChange={(e) => setpickup(e.target.value)}>
  <option>Select Pick-Up Restaurant</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</Form.Select>
  </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3" >
    <Form.Label>Drop Location</Form.Label>

    <Form.Select aria-label="Select Drop Location" onChange={(e) => setdrop(e.target.value)}>
  <option>Select Drop Location</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</Form.Select>
  </Form.Group>
              </Col>
            </Row>
           
            <Row>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Enter Starting KM</Form.Label>
              <Form.Control type="number" placeholder="Enter the customer phone" />

              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Enter Starting KM</Form.Label>
              <Form.Control type="number" placeholder="Enter the customer phone" />

              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Enter Starting KM</Form.Label>
              <Form.Control type="number" placeholder="Enter the customer phone" />

              </Form.Group>
              </Col>
            </Row>
            <Button className={{alignSelf: 'center'}} variant="primary" type="submit">
    Calculate
  </Button>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Enter Starting KM</Form.Label>
              <Form.Control type="number" placeholder="Enter the customer phone" />

              </Form.Group>


              <div className="d-grid gap-2">
  <Button variant="primary" type="submit" size="lg">
    Submit
  </Button>
  </div>
</Form>
        </>
      ) : (
        null
      )}
  
      <div>

      </div>
      <h1 style={{fontFamily:"'Montserrat', sans-serif;", margin:"20px 0"}}>Search Menu</h1>

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