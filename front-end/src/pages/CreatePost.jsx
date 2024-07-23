import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import { createPost, getMe } from "../services/api";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useEffect } from "react";

function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: {
      value: 0,
      unit: "minutes",
    },
    author: "",
  });

  const [coverFile, setCoverFile] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTime") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("il pulsante funziona");
    try {
      const formData = new FormData();
      Object.keys(post).forEach((key) => {
        if (key === "readTime") {
          formData.append("readTime[value]", post.readTime.value);
          formData.append("readTime[unit]", post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });
      if (coverFile) {
        formData.append("cover", coverFile);
      }
      await createPost(formData);
      navigate("/");
    } catch (err) {
      console.error("errore nella creazione del post", err);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3 mt-5">
          <Col md={6}>
            <InputGroup>
              <Form.Control
                name="title"
                value={post.title}
                placeholder="Title"
                onChange={handleChange}
                aria-label="Title"
                aria-describedby="basic-addon1"
                data-custom-input
              />
            </InputGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Control
              name="content"
              value={post.content}
              as="textarea"
              rows={5}
              onChange={handleChange}
              aria-label="Content"
              placeholder="Content"
              data-custom-input
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              name="author"
              type="email"
              value={post.author}
              onChange={handleChange}
              placeholder="Author"
              aria-label="Author"
              aria-describedby="basic-addon2"
              data-custom-input
            />
          </Col>
          <Col md={4}>
            <Form.Select
              aria-label="Category"
              name="category"
              value={post.category}
              onChange={handleChange}
              data-custom-input
            >
              <option value="">Category</option>
              <option value="Sport">Sport</option>
              <option value="Videogames">Videogames</option>
              <option value="Actuality">Actuality</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <InputGroup>
              <Form.Control
                id="readTime"
                name="readTime"
                value={post.readTime.value}
                onChange={handleChange}
                type="number"
                aria-label="Amount (to the nearest minute)"
                placeholder="Read Time"
                data-custom-input
              />
              <InputGroup.Text>minutes</InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formFile">
              <Form.Control
                name="cover"
                type="file"
                onChange={handleFileChange}
                // value={post.cover}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col className="d-flex justify-content-center">
            <Button variant="outline-success" type="submit" data-custom-input>
              Crea il post
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default CreatePost;
