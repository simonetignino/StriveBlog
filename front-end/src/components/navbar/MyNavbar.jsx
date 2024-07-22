import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import "./MyNavbar.css";

function MyNavbar({
  isLogged,
  setIsLogged,
  posts,
  filteredPosts,
  setFilteredPost,
}) {
  // Funzinoe per il logout
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    navigate("/login");
  };

  // Faccio la funzione per ricercare. Per scelta sto decidendo di trovare i risultati solo quando clicco sul pulsante
  // Definisco uno useState
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(inputValue.toLowerCase()),
    );
    setFilteredPost(filteredPosts);
    // console.log(filteredPosts);
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-font">
          StriveBlog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/create" className="nav-link">
              New Post
            </Nav.Link>
          </Nav>
          <Form onSubmit={handleSubmit} className="d-flex me-2">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search posts..."
                className="search-input"
                value={inputValue}
                onChange={handleInputChange}
              />
              <Button
                variant="outline-light"
                type="submit"
                className="search-btn"
              >
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-light"
              id="dropdown-basic"
              className="settings-btn"
            >
              <i className="bi bi-gear"></i>
            </Dropdown.Toggle>

            {isLogged && (
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/account">
                  <i className="bi bi-person me-2"></i> Manage Account
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

MyNavbar.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  setIsLogged: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  filteredPosts: PropTypes.array.isRequired,
  setFilteredPost: PropTypes.func.isRequired,
};

export default MyNavbar;
