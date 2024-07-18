import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function BlogPosts({ posts }) {
  return (
    <Row xs={2} sm={3} md={4} lg={4} className="g-4">
      {posts.map((post) => (
        <Col className="mb-3" key={post._id}>
          <Link to={`/post/${post._id}`} key={post._id}>
            <Card>
              <Card.Img src={post.cover} alt={post.title} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>By: {post.author}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}
BlogPosts.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default BlogPosts;
