import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import SiteLayout from "../common/SiteLayout";
import { API_URL } from "../../config";

const UserHome = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/rooms/getallrooms`);
        setRooms(res.data);
      } catch (error) {
        console.error("Failed to fetch rooms");
      }
    };
    fetchRooms();
  }, []);

  return (
    <SiteLayout user={user} links={[{ label: "My bookings", to: "/mybookings" }]}>
      <Container className="site-content site-page">
        <div className="mb-4">
          <span className="site-eyebrow">Welcome back{user.name ? `, ${user.name}` : ""}</span>
          <h1 className="site-heading display-6 mt-2">Find your next stay</h1>
          <p className="site-subheading mb-0">Browse available rooms and find a space that feels right.</p>
        </div>
        {rooms.length > 0 ? (
          <Row className="g-4">
          {rooms.map(room => (
            <Col md={6} lg={4} key={room._id}>
              <Card className="site-card site-room-card h-100">
                <Card.Img 
                  className="site-card-image"
                  variant="top" 
                  src={room.photos?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=90"} 
                  alt={`${room.type} hotel room`}
                  loading="lazy"
                  decoding="async"
                  style={{ height: "240px" }} 
                />
                <Card.Body className="d-flex flex-column p-4">
                  <span className="site-eyebrow">{room.type}</span>
                  <Card.Title className="mt-2">{room.type} Room</Card.Title>
                  <Card.Text className="site-subheading">
                    {room.description}
                    <br />
                    <span className="d-inline-block mt-2">Up to {room.count} guests</span>
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
                    <strong>₹{Number(room.rent).toLocaleString("en-IN")} <small className="text-secondary fw-normal">/ night</small></strong>
                    <Button
                      onClick={() => navigate(`/book/${room._id}`, { state: { room } })}
                    >
                      Book room
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
          </Row>
        ) : (
          <Card className="site-card border-0">
            <Card.Body className="p-5 text-center">
              <h2 className="site-heading h4">No rooms available just yet</h2>
              <p className="site-subheading mb-0">Please check back soon for available stays.</p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </SiteLayout>
  );
};

export default UserHome;
