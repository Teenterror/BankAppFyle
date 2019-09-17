import React from 'react';
import {Navbar} from 'react-bootstrap'; 

const Header = () => (
  <header>
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand href="#home"><div style={{color: 'white'}}>Bank App</div></Navbar.Brand>
    </Navbar>
  </header>
);

export default Header;