import { Card, Col, Row, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./BlogPosts.css";

function BlogPosts({ posts }) {
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
      {posts.map((post) => (
        <Col key={post._id}>
          <Link to={`/post/${post._id}`} className="blog-post-link">
            <Card className="h-100 shadow-sm hover-effect">
              <Card.Img variant="top" src={post.cover} alt={post.title} />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold mb-3">{post.title}</Card.Title>
                <Card.Text className="text-muted small mb-2">
                  By: {post.author}
                </Card.Text>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <Badge bg="light" text="dark" className="read-time">
                    <i className="bi bi-clock me-1"></i>
                    {post.readTime.value} min read
                  </Badge>
                  <small className="text-muted">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>
                </div>
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
