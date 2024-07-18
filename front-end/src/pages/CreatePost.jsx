import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import { Button } from "react-bootstrap";

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
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3 mt-3 w-25">
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

      <InputGroup>
        <Form.Control
          name="content"
          value={post.content}
          className="mb-3"
          onChange={handleChange}
          as="textarea"
          rows={5}
          aria-label="Content"
          placeholder="Content"
          data-custom-input
        />
      </InputGroup>

      <InputGroup className="mb-3 d-flex align-items-center justify-content-center">
        <Form.Control
          name="author"
          type="email"
          className="me-2"
          value={post.author}
          onChange={handleChange}
          placeholder="Author"
          aria-label="Author"
          aria-describedby="basic-addon2"
          data-custom-input
        />
        <Form.Group className="me-2">
          <Form.Select
            aria-label="Default select example"
            name="category"
            value={post.category}
            onChange={handleChange}
            data-custom-input
          >
            <option>Category</option>
            <option value="Sport">Sport</option>
            <option value="Videogames">Videogames</option>
            <option value="Actuality">Actuality</option>
          </Form.Select>
        </Form.Group>

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
        <InputGroup.Text id="basic-addon2">minutes</InputGroup.Text>
      </InputGroup>

      <InputGroup className="d-flex justify-content-between">
        <Form.Group controlId="formFile" className="w-50">
          <Form.Control
            name="cover"
            type="file"
            onChange={handleFileChange}
            // value={post.cover}
          />
        </Form.Group>
      </InputGroup>
      <Button
        className="mt-3 mb-5 w-25"
        variant="outline-success"
        type="submit"
        data-custom-input
      >
        Crea il post
      </Button>
    </Form>
  );
}

export default CreatePost;
