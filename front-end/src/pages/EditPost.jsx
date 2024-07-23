import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { deletePost, getMe, getPost, updatePost } from "../services/api";

function EditPost() {
  const { id } = useParams();
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

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPost(id);
        // console.log(response);
        const post = response.data;
        // console.log(post);
        setPost(post);
      } catch (err) {
        console.error("Errore nel caricamento del post:", err);
      }
    }
    fetchPost();
  }, [id]);

  // const fetchAuthorEmail = async () => {
  //   try {
  //     const authorData = await getMe();
  //     console.log(authorData);
  //     console.log(post.author);
  //     if (authorData.email !== post.author) {
  //       alert("non puoi accedere a questa funzione");
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.error("Errore nel recupero dei dati utente:", error);
  //     navigate("/");
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTime") {
      setPost((prevPost) => ({
        ...prevPost,
        readTime: {
          ...prevPost.readTime,
          value: parseInt(value) || 0,
        },
      }));
    } else {
      setPost((prevPost) => ({ ...prevPost, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    // fetchAuthorEmail();
    e.preventDefault();
    try {
      const updatedPost = {
        ...post,
        readTime: post.readTime || { value: 0, unit: "minutes" },
      };
      console.log(id);
      const response = await updatePost(id, updatedPost);
      setPost(response.data);
      navigate(`/post/${id}`);
    } catch (err) {
      console.error("Errore nella modifica del post:", err);
    }
  };

  const handleDelete = async (e) => {
    // fetchAuthorEmail();
    e.preventDefault();
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      console.error("Post non trovato", err);
    }
  };

  return (
    <Container>
      <Form>
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
                // value={post.cover}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col className="d-flex justify-content-center">
            <Button
              onClick={handleUpdate}
              className="me-3"
              variant="outline-success"
              type="submit"
              data-custom-input
            >
              Modifica
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline-danger"
              type="submit"
              data-custom-input
            >
              Elimina
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default EditPost;
