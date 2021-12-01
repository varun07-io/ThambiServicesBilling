import React from 'react';
import './Navbar.css'
import {Navbar,Container} from 'react-bootstrap'
import { Link } from 'react-router-dom';

function Navbar1() {
    return(
      
        <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">
            {/* <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '} */}
          Thambi Services (billing)
          </Navbar.Brand>
          <Link to="/">
              Home
          </Link>
        </Container>
      </Navbar>
    )
}

export default Navbar1;