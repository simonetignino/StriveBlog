import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Button } from "react-bootstrap";

export default function Register() {
  // console.log("vengo caricato");
  // Definisce lo stato del form con useState, inizializzato con campi vuoti
  const [author, setAuthor] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    avatar: "",
    birthday: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const navigate = useNavigate(); // Inizializza useNavigate per poter navigare programmaticamente

  // Gestore per aggiornare lo stato quando i campi del form cambiano
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor({ ...author, [name]: value });
  };

  // Gestore per la sottomissione del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("il pulsante funziona");
    try {
      const formData = new FormData();
      Object.keys(author).forEach((key) => {
        formData.append(key, author[key]);
      });
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      await registerUser(formData);
      navigate("/");
    } catch (err) {
      console.error("errore nella creazione del author", err);
    }
  };

  return (
    <Form
      className="mt-3 d-flex flex-column justify-content-center align-items-center"
      onSubmit={handleSubmit}
    >
      <h2 className="mb-4">Register</h2>
      <InputGroup className="mb-3 ">
        <Form.Control
          name="name"
          placeholder="Name"
          aria-label="Name"
          aria-describedby="basic-addon1"
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup className="mb-3 ">
        <Form.Control
          name="surname"
          placeholder="Surname"
          aria-label="Surname"
          aria-describedby="basic-addon1"
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup className="mb-3 ">
        <Form.Control
          name="email"
          placeholder="Email"
          aria-label="Email"
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup className="mb-3 ">
        <Form.Control
          name="birthday"
          type="date"
          placeholder="Birthday"
          aria-label="Birthday"
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
      </InputGroup>
      <InputGroup className="mb-3 ">
        <Form.Control
          name="avatar"
          type="file"
          placeholder="avatar"
          aria-label="avatar"
          aria-describedby="basic-addon2"
          onChange={handleFileChange}
        />
      </InputGroup>
      <InputGroup className="mb-3 ">
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          aria-label="Password"
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
      </InputGroup>
      <InputGroup className="mb-3  d-flex justify-content-between align-items-center">
        <Button type="submit" variant="success">
          Register Now
        </Button>
        {"or"}
        <Link to="/login">
          <Button variant="primary">Login</Button>
        </Link>
      </InputGroup>
    </Form>
  );
}
