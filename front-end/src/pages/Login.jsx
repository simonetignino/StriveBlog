import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { InputGroup } from "react-bootstrap";

function BasicExample() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      // console.log(formData); //Chiama la funzoine loginUser per autenticare l'utente
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // console.log(response.token);
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      navigate("/");
    } catch (err) {
      console.error("errore durante il login:", err);
      alert("Credenziali non valide. Riprova");
    }
  };

  return (
    <Form
      className="w-25 d-flex justify-content-center align-items-center flex-column mt-4"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-4">Login</h2>
      <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" onChange={handleChange} />
      </Form.Group>

      <Form.Group className="mb-3 w-100" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} />
      </Form.Group>
      <InputGroup className="w-100 d-flex justify-content-between align-items-center">
        <Button type="submit" variant="primary" className="rounded-2">
          Login
        </Button>
        {"or"}
        <Link to="/register">
          <Button variant="success">Register Now</Button>
        </Link>
      </InputGroup>
    </Form>
  );
}

export default BasicExample;
