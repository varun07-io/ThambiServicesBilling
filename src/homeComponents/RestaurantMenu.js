import React, { useState,useEffect,useRef } from "react";
import RestaurantMenuItems from "./RestaurantMenuItems";
import { useHistory } from "react-router-dom";
import "./RestaurantMenu.css";
import { Container, Row, Col, Table,Spinner } from "react-bootstrap";
import { AddToCart } from "./buttons/AddToCart";
import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import 'firebase/database'
import { useParams } from 'react-router-dom';
import 'firebase/storage'
import LoadingCard from "./LoadingCard";

import { Popover } from 'react-tiny-popover'
import { RemoveCartItems } from "./buttons/RemoveCartItems";
import tw from "twin.macro";
import { BillingButton } from "./buttons/BillingButton";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Form,Button } from "react-bootstrap";
import { height } from "dom-helpers";

const Card = tw.div`bg-white rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0 shadow-lg p-2 font-extrabold`;
const ContainerC = tw.div`relative min-h-screen`;
const ContentWithPaddingXlC= tw.div`max-w-screen-xl mx-auto py-5 lg:py-5`;


const firebaseConfig = {
  apiKey: "AIzaSyBC3HA7BlKnIiDndgCBJDDcJBhqWK1kpHg",
  authDomain: "thambi-billing.firebaseapp.com",
  projectId: "thambi-billing",
  storageBucket: "thambi-billing.appspot.com",
  messagingSenderId: "458541627224",
  appId: "1:458541627224:web:bee668dc36998e724ed72d",
  measurementId: "G-DFEW0H7Z0T"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

const ref = React.createRef();

function RestaurantMenu() {

  const { name } = useParams();




  const [allMenuFromAskedRestaurants, setallMenuFromAskedRestaurants] = useState([]);
  const [isLoading, setisLoading] = useState(false)
  
  const getAllMenus = () => {
    setisLoading(true)
    let myRef =  firebase.database().ref(`/menu`).orderByChild("restaurant").equalTo(name).on('value', snapshot => {
      let temp_menu = []
      snapshot.forEach((t) => {
        temp_menu.push(t.val())
      })
      console.log(temp_menu);
      setCart(temp_menu)
      setisLoading(false)
    })
  }
  useEffect(() => {
      getAllMenus()
  }, [])
  const [cart, setCart] = useState(allMenuFromAskedRestaurants);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const isLoadingSection = () => {
    if(isLoading){
      return(
        <div className="loading">
          <div></div>
          <div></div>
         </div> 
      )
    }
  }



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
          if (item.count > 100) {
            return item;
          } else return { ...item, count: item.count + 1 };
        } else if (i === o) {
          if (item.counterVal > 100) {
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
      <b className="cart--empty">CART IS EMPTY</b>
    ) : (
      <>
        <div className="total--cart--card">
          <p>Items in Cart: {cartCountTotal}</p>
          <p>
            Total Price: Rs-
            {Number.isInteger(cartPriceTotal)
              ? cartPriceTotal
              : cartPriceTotal.toFixed(2)}
          </p>
          <BillingButton onClick={() => setIsPopoverOpen(!isPopoverOpen)} buttonSize="billing--btn--medium" buttonStyle="billing--btn--outline" >Proceed for Billing</BillingButton>
        </div>
      </>
    );

  const cartItems = cart.map((item, i) => (
    <React.Fragment  key={item.name}>
      {item.inCart && (
        <div className="cart--card">
          <p style={{fontWeight:"800"}}> Item Name: {item.name}</p>
          <p style={{fontWeight:"800"}}>
            Item Count: <button style={{backgroundColor:"#5B5C79", borderRadius:"5px", margin:"0 5px", color:"#fff", boxShadow: "0px 15px 10px -7px #111"}} onClick={() => decreaseQuantity(i)}>-</button>{" "}
            <input className="input_cart" readOnly type="text" value={item.count} /> <button style={{backgroundColor:"#5B5C79", borderRadius:"5px", margin:"0 5px", color:"#fff", boxShadow: "0px 15px 10px -7px #111"}} onClick={() => increaseQuantity(i)}>+</button>
          </p>
          <p style={{fontWeight:"800"}}>
            Item Subtotal: Rs-
            {Number.isInteger(item.count * item.price)
              ? item.count * item.price
              : `${(item.count * item.price).toFixed(2)}`}
          </p>
          <RemoveCartItems buttonSize="remove--btn--medium" buttonStyle="remove--btn--outline" onClick={() => removeFromCart(i)}>Remove From Cart</RemoveCartItems>
          
        </div>
      )}
    </React.Fragment>
  ));

  const cartProducts = () => (
    <div className="flexParent">
      {isLoadingSection()}
     {cart && cart.filter((item) => {
            if (searchTerm == "") {
              return item
            } else if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return item
            }
          }).map((item, i) => (
        <Card key={i}>
          <p>{item.name}</p>
          <p>{item.restaurantname}</p>
          <p>Price: Rs-{item.price}</p>
          {!item.inCart ? (
            <>
              <button style={{backgroundColor:"#5B5C79", borderRadius:"6px", margin:"0 5px", color:"#fff", boxShadow: "0px 15px 10px -7px #111"}} onClick={() => decreaseQuantity(i)}>-</button>
              <input className="input_cart" readOnly type="text" value={item.counterVal} />
              <button style={{backgroundColor:"#5B5C79", borderRadius:"6px", margin:"0 5px", color:"#fff", boxShadow: "0px 15px 10px -7px #111"}} onClick={() => increaseQuantity(i)}>+</button>
              <br />
              <AddToCart buttonSize="cart--btn--medium" buttonStyle="cart--btn--outline" onClick={() => addToCart(i)}>add</AddToCart>
            </>
          ) : (
            <p>
              <b className="itemadded--card">Item added!</b>
            </p>
          )}
        </Card>
      ))}
    </div>
  );
  


  const [searchTerm, setSearchTerm] = useState("");
  
  const [orderNumber, setorderNumber] = useState(0);
  const [todaysDate, settodaysDate] = useState(new Date().toISOString().slice(0, 10));
  const [customerName, setcustomerName] = useState('');
  const [customerPhone, setcustomerPhone] = useState(0);
  const [deliveryBoyName, setdeliveryBoyName] = useState('');
  const [contactNumber, setcontactNumber] = useState(0);
  const [pickup, setpickup] = useState('');
  const [drop, setdrop] = useState('');
  const [estimatedDistance, setestimatedDistance] = useState(0);
  const [startandendKm, setstartandendKm] = useState('');
  const [billItem, setbillItem] = useState([]);
  const [billAmout, setbillAmout] = useState(0);
  const [deliveryChange, setdeliveryChange] = useState(0);
  const [otherCharges, setotherCharges] = useState(0);
  const [grandTotal, setgrandTotal] = useState(0);

  const [allRestaurnats, setallRestaurnats] = useState([]);

  const getAllRestaurant = () => {
    let myRef =  firebase.database().ref(`/restaurants`).on('value', snapshot => {
      // console.log(snapshot.val()); 
      setallRestaurnats(snapshot.val())
    })
  }
  useEffect(() => {
    getAllRestaurant()
  }, [])


  const calculateDeliveryPrice = (e) => {
    e.preventDefault();

    setbillAmout(cartPriceTotal.toFixed(2))
    let distance = estimatedDistance;
    if(distance > 5){
      let sub_distance = distance - 5;
      let total = (sub_distance * 24) + (5 * 35)
      setdeliveryChange(total)
      let grand_total = (total + parseFloat(cartPriceTotal.toFixed(2)) + parseInt(otherCharges))
      console.log("grand Total - ",total + parseFloat(cartPriceTotal.toFixed(2)) + parseInt(otherCharges));
    setgrandTotal(grand_total)

    }
    else{
      let sub_distance = distance * 35;
      setdeliveryChange(sub_distance)
      let grand_total = (sub_distance + parseFloat(cartPriceTotal.toFixed(2)) + parseInt(otherCharges))

    setgrandTotal(grand_total)

    }
  }

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });

  const ComponentToPrint = React.forwardRef((props, ref) => (
    <div ref={ref} style={{padding:"1rem", backgroundColor:"#fff", fontWeight:"800", fontSize:"0.8rem", width:"360px"}} >
      <div style={{padding:"5px", border:"2px solid #131313"}}>
      <h2 style={{fontWeight:"800", textAlign:"center", fontSize:"1.3rem"}}>Thambi Services</h2>
      <p style={{textAlign:"center", fontSize:"0.6rem"}}>55, Pollachi Main Road No.10 Shopping Mall Near Dorais Theatre Mahalingapuram, Pollachi, Tamil Nadu 642002.</p>
      <Row>
        <Col>
        <p style={{fontWeight:"800", fontSize:"0.8rem"}}>
        Order ID: {orderNumber}
      </p></Col>
      <Col>
      <p style={{fontWeight:"800", display:"flex", justifySelf:"flex-end", fontSize:"0.8rem" }}>
        Date: {todaysDate}
      </p></Col>
      </Row>
      <p style={{fontWeight:"800", fontSize:"0.8rem"}}>
        Name: {customerName}
      </p>
      <p style={{fontWeight:"800", fontSize:"0.8rem"}}>
        Phone: {customerPhone}
      </p>
      
      <p style={{fontWeight:"800", fontSize:"0.8rem"}}>
        Delivery By: {deliveryBoyName}
      </p>
      
      <Table>
        <thead>
          <tr>
            <th>Order no.</th>
            <th>Name</th>
            <th>Qty.</th>
            <th>Total Amnt.</th>
          </tr>
        </thead>
        <tbody>


                        {cart.map((item, i) => (
          <React.Fragment  key={item.name}>
            {item.inCart && (
                  <tr>
                  <td><p>{i-1}</p></td>
                  <td><p>{item.name}</p></td>
                  <td><p>
                  {/* <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => decreaseQuantity(i)}>-</button>{" "} */}
                  {item.count} 
                  {/* <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => increaseQuantity(i)}>+</button> */}
                </p></td>
                  <td>

                  <p>
                  {Number.isInteger(item.count * item.price)
                    ? item.count * item.price
                    : `${(item.count * item.price).toFixed(2)}`}
                </p>
                  </td>
                </tr>
              // <div
              // style={{
              //     borderWidth:5,
              //     borderRadius: 12,
              //     padding:12
              // }}
              // className="flexParent"
              // >
                
                
                
              
              //   <RemoveCartItems buttonSize="remove--btn--medium" buttonStyle="remove--btn--outline" onClick={() => removeFromCart(i)}>Remove From Cart</RemoveCartItems>
              //   <hr />
              // </div>
            )}
          </React.Fragment>
        ))}
          
          </tbody>
      </Table>

              <p style={{fontWeight:"800", fontSize:"0.8rem"}}>
                Pick-up: {pickup}
              </p>
              <p style={{fontWeight:"800", fontSize:"0.8rem"}}>
                Drop Location: {drop}
              </p>
              <hr style={{backgroundColor:"#F54F2B", height:"2px"}} />
              <p style={{fontWeight:"800", fontSize:"0.7rem"}}>
                Restaurant Bill amount: {billAmout}
              </p>
              <p style={{fontWeight:"800", fontSize:"0.7rem"}}>
                Delivery Amount: {deliveryChange}
              </p>
              <hr style={{backgroundColor:"#F54F2B", height:"2px"}}/>
              <p style={{fontWeight:"800", fontSize:"1rem"}}>
                Total: {grandTotal}
              </p>
              </div>
    </div>
  ));


  const componentRef = useRef();


  const enterBillDetails = () => 
  {
    return(
    

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
              <Form.Control type="number" value={orderNumber} placeholder="Enter the order number" onChange={(e) => setorderNumber(e.target.value)}/>

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
              <Form.Control type="text" placeholder="Enter the customer Name"  onChange={(e) => setcustomerName(e.target.value)}/>

              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Enter Customer Phone</Form.Label>
              <Form.Control type="number" placeholder="Enter the customer phone" onChange={(e) => setcustomerPhone(e.target.value)}/>

              </Form.Group>
              </Col>
            </Row>
            <div
            style={{
              backgoundColor:'blue'
            }}
            >

<Table striped bordered hover>
  <thead>
    <tr>
      <th>Order Number</th>
      <th>Item Name</th>
      <th>Item Count</th>
      <th>Item Sub-total Rs</th>
    </tr>
  </thead>
  <tbody>


                  {cart.map((item, i) => (
    <React.Fragment  key={item.name}>
      {item.inCart && (
            <tr>
            <td><p>{i-1}</p></td>
            <td><p>{item.name}</p></td>
            <td><p>
            {/* <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => decreaseQuantity(i)}>-</button>{" "} */}
            {item.count} 
            {/* <button style={{backgroundColor:"#80ED99", borderRadius:"5px", margin:"0 5px"}} onClick={() => increaseQuantity(i)}>+</button> */}
          </p></td>
            <td>

            <p>
            {Number.isInteger(item.count * item.price)
              ? item.count * item.price
              : `${(item.count * item.price).toFixed(2)}`}
          </p>
            </td>
          </tr>
        // <div
        // style={{
        //     borderWidth:5,
        //     borderRadius: 12,
        //     padding:12
        // }}
        // className="flexParent"
        // >
          
          
          
         
        //   <RemoveCartItems buttonSize="remove--btn--medium" buttonStyle="remove--btn--outline" onClick={() => removeFromCart(i)}>Remove From Cart</RemoveCartItems>
        //   <hr />
        // </div>
      )}
    </React.Fragment>
  ))}
    
    </tbody>
</Table>
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
          {/* <BillingButton onClick={() => setIsPopoverOpen(!isPopoverOpen)} buttonSize="billing--btn--medium" buttonStyle="billing--btn--outline" >Proceed for Billing</BillingButton> */}
        </b>
      </>
    )}
            </div>
            <div
              style={{
                backgroundColor: '#5b5c79',
                padding:20,
                borderRadius: 10,
                color: 'white',
                marginTop:12,
                marginBottom: 12
              }}
            >
  <Row 

  >
              <Col >
              <Form.Group className="mb-3" >
    <Form.Label>Pick-Up Location</Form.Label>

    <Form.Select aria-label="Select Pick-up Location" value={pickup} onChange={(e) => setpickup(e.target.value)}>
  <option>Select Pick-Up Restaurant</option>
  {allRestaurnats && Object.entries(allRestaurnats).map(P => {
                          // console.log(P[1].name);
                        return <option value={P[1].name}>{P[1].name}</option>
                        })}
</Form.Select>
  </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3" >
    <Form.Label>Drop Location</Form.Label>

              <Form.Control type="text" onChange={(e) => setdrop(e.target.value)} value={drop} placeholder="Enter the Drop Location" />
  </Form.Group>
              </Col>
              <Form.Group className="mb-3" >
    <Form.Label>Enter the estimated distance</Form.Label>

              <Form.Control type="number" onChange={(e) => setestimatedDistance(e.target.value)} placeholder="Enter the Drop Location" />
  </Form.Group>
  <Button style={{marginBottom:25,marginTop:15,paddingRight:15,paddingLeft:15, backgroundColor:"#F54F2B"}} variant="primary" type="submit" size="sm" onClick={calculateDeliveryPrice}>
    Calculate
  </Button>
            </Row>
            <Row>
              
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Bill Amount</Form.Label>
              <Form.Control type="number" value={billAmout} placeholder="Enter the customer phone" onChange={(e) => setbillAmout(e.target.value)} />
              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Delivery Charges</Form.Label>
              <Form.Control type="number" value={deliveryChange} placeholder="Enter the customer phone" onChange={(e) => setdeliveryChange(e.target.value)}/>
              </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>Other Charged</Form.Label>
              <Form.Control type="number" value={otherCharges} placeholder="Enter the customer phone" onChange={(e) => setotherCharges(e.target.value)}/>
              </Form.Group>
              </Col>
            </Row>
 
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Enter Starting KM</Form.Label>
              <Form.Control type="number" placeholder="Enter the customer phone" />

              </Form.Group>


              <div className="d-grid gap-2">
          

  </div>
</Form>
        </>
    
    )
  }

  const viewGenerateBillDetails = () => {
    return(
      <React.Fragment>
      <ComponentToPrint ref={componentRef} />
      <button onClick={() => exportComponentAsJPEG(componentRef)} className="export--button">
        Export As JPEG
      </button>
      <button onClick={() => exportComponentAsPDF(componentRef)} className="export--button">
        Export As PDF
      </button>
      <button onClick={() => exportComponentAsPNG(componentRef)} className="export--button">
        Export As PNG
      </button>
    </React.Fragment>
    )
  }

  let history = useHistory();

  return (
    <ContainerC className="resmenu--main">
      <ContentWithPaddingXlC>


  
      <div>
        {isPopoverOpen ? (
          
      <Container>
        <button onClick={() => history.goBack()} className="back--button">Back</button>
      <Row>
          <Col sm={8}>{enterBillDetails()} </Col>
          <Col sm={4}>
         {viewGenerateBillDetails()}</Col>
      </Row>
      </Container>
        ) : (
          null
        )}
        {isPopoverOpen ? (null) : (<button onClick={() => history.goBack()} className="back--button">Back</button>)}
         
          <p style={{textAlign:"center"}}>(search with dish name)</p>
      
    
  
      <Form.Control  style={{borderRadius:"1.5rem"}} type="text" placeholder="Dish name" onChange={event => {setSearchTerm(event.target.value)}} />
      <ContentWithPaddingXlC>
        <Container>
          
          <Row>
              <Col sm={8}>{cartProducts()} </Col>
              <Col sm={4}>
              {cartItems} {cartTotals()}</Col>
          </Row>
          </Container>
        </ContentWithPaddingXlC>
      </div>
      
     
      </ContentWithPaddingXlC>
    </ContainerC>
  );
}

export default RestaurantMenu;