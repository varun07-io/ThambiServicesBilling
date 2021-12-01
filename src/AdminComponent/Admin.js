import React, {useState, useEffect} from 'react'
import { Tabs,Tab, Container } from 'react-bootstrap'
import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
import 'firebase/database'
import 'firebase/storage'
import { v4 as uuidv4 } from 'uuid';

import {Form, Button, Alert} from 'react-bootstrap'


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






export default function Admin(props) {


  const [restaurantName, setrestaurantName] = useState('');
  const [restaurantLocation, setrestaurantLocation] = useState('');
  

  const [menuName, setmenuName] = useState('');
  const [menuPrice, setmenuPrice] = useState(0);
  const [inRestaurant, setinRestaurant] = useState('');
  const [manuCategory, setmanuCategory] = useState('');
  const [deliveryBoyName, setdeliveryBoyName] = useState('');

  const [isSuccess, setisSuccess] = useState(false);

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

  const uploadRestaurants = (e) => {
      e.preventDefault();
      let id = uuidv4();
      let myRef =  firebase.database().ref(`/restaurants/${id}`);
      myRef.set({
        name: restaurantName,
        location: restaurantLocation
      })
      .then(res => {
          setisSuccess(true)
          setrestaurantLocation('')
          setrestaurantName('')
          setTimeout(() => {
             setisSuccess(false) 
          }, 2000);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const uploadMenu = (e) => {
    e.preventDefault();
    let id = uuidv4();
    let myRef =  firebase.database().ref(`/menu/${id}`);
    myRef.set({
      name: menuName,
      category: manuCategory,
      price: menuPrice,
      restaurant: inRestaurant.toString().replace(/\s/g, ""),
      count: 0,
      counterVal: 1,
      inCart: false
    })
    .then(res => {
      setisSuccess(true)
      setmenuName('')
      setmanuCategory('')
      setmenuPrice(0)
      setinRestaurant('')
      setTimeout(() => {
         setisSuccess(false) 
      }, 2000);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const uploadDeliveryBoy = (e) => {
    e.preventDefault();
    let id = uuidv4();
    let myRef =  firebase.database().ref(`/delivery/${id}`);
    myRef.set({
      name: deliveryBoyName
    })
    .then(res => {
      setisSuccess(true)
      setdeliveryBoyName('')
      setTimeout(() => {
         setisSuccess(false) 
      }, 2000);
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
        <div>
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3"
        style={{
          padding: 35
        }}
        >
        <Tab eventKey="Add Restaurant" title="Add Restaurant">
        {isSuccess ? (
            <Alert
            variant='success'
            >
              Uploaded
          </Alert>
        ) : (
          null
        )}
        <Container>
              <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={restaurantName} type="text" placeholder="Enter the restaurant name" onChange={(e) => setrestaurantName(e.target.value)}/>
                    </Form.Group>
              <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control value={restaurantLocation} type="text" placeholder="Enter the restaurant Location" onChange={(e) => setrestaurantLocation(e.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" size="lg" onClick={uploadRestaurants}>
                          Save Restaurant
                    </Button>
        </Container>
        
        </Tab>
        <Tab eventKey="Add Menu" title="Add Menu">
        {isSuccess ? (
            <Alert
            variant='success'
            >
              Uploaded
          </Alert>
        ) : (
          null
        )}
        <Container>
              <Form.Group className="mb-3" >
                  <Form.Label>Select Restaurant</Form.Label>

                  <Form.Select aria-label="Select Drop Location" value={inRestaurant} onChange={(e) => setinRestaurant(e.target.value)}>
                        <option>Select Restaurant</option>
                        {allRestaurnats && Object.entries(allRestaurnats).map(P => {
                          // console.log(P[1].name);
                        return <option value={P[1].name}>{P[1].name}</option>
                        })}
              </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                    <Form.Label>Menu Name</Form.Label>
                    <Form.Control value={menuName} type="text" placeholder="Enter the menu name" onChange={(e) => setmenuName(e.target.value)}/>
                    </Form.Group>
              <Form.Group className="mb-3">
                    <Form.Label>Menu Category</Form.Label>
                    <Form.Control value={manuCategory} type="text" placeholder="Enter the menu category" onChange={(e) => setmanuCategory(e.target.value)}/>
                    </Form.Group>
              <Form.Group className="mb-3">
                    <Form.Label>Menu Price</Form.Label>
                    <Form.Control value={menuPrice} type="number" placeholder="Enter the menu price" onChange={(e) => setmenuPrice(e.target.value)}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" size="lg" onClick={uploadMenu}>
                          Save Restaurant
                    </Button>
        </Container>
        </Tab>
        <Tab eventKey="Add Delivery" title="Add Delivery Boy">
        {isSuccess ? (
            <Alert
            variant='success'
            >
              Uploaded
          </Alert>
        ) : (
          null
        )}
        <Container>
              <Form.Group className="mb-3">
                    <Form.Label>Delivery Boy Name</Form.Label>
                    <Form.Control value={deliveryBoyName} type="text" placeholder="Enter the name" onChange={(e) => setdeliveryBoyName(e.target.value)}/>
                    </Form.Group>  
                    <Button variant="primary" type="submit" size="lg" onClick={uploadDeliveryBoy}>
                          Save Restaurant
                    </Button>
                    </Container>
        </Tab>
      </Tabs>
      </div>
    )
}
