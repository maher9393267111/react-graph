import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../firebase";
import { AuthContext } from "../context/authContext";
import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";

import Search from './Search'

const Navbar1 = () => {
  const { state, dispatch } = useContext(AuthContext);
  let history = useHistory();

  const { user } = state;

  const logout = () => {
    auth.signOut();
    console.log(user);
    dispatch({
      type: "LOGGED_IN_USER",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">
          <Link className="navbar-brand" to="/">
            Navbar
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
  {user && (
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            )}




            {!user && (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}

            {!user && (
              <Link className="nav-link" to="/register">
                register
              </Link>
            )}

            {user && (
              <li className="nav-item">
                <a onClick={logout} href="/login" className="nav-item nav-link">
                  Logout
                </a>
              </li>
            )}
          </Nav>
         

<Search/>


        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navbar1;

{
  /* <NavDropdown  id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">
              <Link className="nav-link" to="/login">
                         Login
                  </Link>
                  
                  
                  </NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                
              <Link className="nav-link" to="/register">
                         Register
                     </Link>


              </NavDropdown.Item>
              <NavDropdown.Divider />
            
            </NavDropdown> */
}
