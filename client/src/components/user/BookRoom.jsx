import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import SiteLayout from "../common/SiteLayout";
import { API_URL } from "../../config";

const BookRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState({ cardholdername: "", cardnumber: "", cvvcode: "", expmonthyear: "" });

  if (!room) {
    return (
      <SiteLayout user={user} links={[{ label: "Browse rooms", to: "/userhome" }]}>
        <Container className="site-content site-page text-center">
          <Card className="site-card border-0 mx-auto p-4" style={{ maxWidth: "36rem" }}>
            <Card.Body>
              <h1 className="site-heading h3">Room details are unavailable</h1>
              <p className="site-subheading">Choose a room from the listings to continue.</p>
              <Button onClick={() => navigate("/userhome")}>Browse rooms</Button>
            </Card.Body>
          </Card>
        </Container>
      </SiteLayout>
    );
  }

  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    
    const start = new Date(fromdate);
    const end = new Date(todate);
    
    if (end <= start) return alert("Check-out date must be after check-in date!");

    const diffTime = Math.abs(end - start);
    const totaldays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalAmount = totaldays * room.rent;

    const bookingData = {
      roomid: room._id,
      type: room.type,
      userid: user.id,
      username: user.name,
      fromdate,
      todate,
      totalAmount,
      totaldays,
      phone: Number(phone),
      cardDetails: card
    };

    try {
      await axios.post(`${API_URL}/api/bookings/bookroom`, bookingData);
      alert("Room booked successfully!");
      navigate("/userhome");
    } catch (error) {
      alert("Booking failed. Please check console for details.");
      console.error(error);
    }
  };

  return (
    <SiteLayout user={user} links={[{ label: "Browse rooms", to: "/userhome" }]}>
      <Container className="site-content site-page">
        <div className="mb-4 text-center">
          <span className="site-eyebrow">One step closer</span>
          <h1 className="site-heading display-6 mt-2">Complete your booking</h1>
          <p className="site-subheading">Add your stay details to request your reservation.</p>
        </div>
        <Card className="site-card mx-auto" style={{ maxWidth: "900px" }}>
          <Card.Header className="border-0 bg-white px-4 pt-4 text-center">
            <h2 className="site-heading h4 mb-0">{room.type} Room</h2>
          </Card.Header>
          <Card.Body className="p-4">
            <Row>
              <Col md={6}>
                <img
                  src={room.photos?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=90"}
                  alt={`${room.type} hotel room`}
                  className="site-card-image rounded mb-3"
                  loading="lazy"
                  decoding="async"
                  style={{ height: "280px" }}
                />
                <p><strong>Type:</strong> {room.type}</p>
                <p><strong>Capacity:</strong> {room.count} People</p>
                <p><strong>Rent:</strong> ₹{Number(room.rent).toLocaleString("en-IN")} / night</p>
                {room.description && <p className="site-subheading">{room.description}</p>}
              </Col>
              
              <Col md={6}>
                <Form onSubmit={handleBook}>
                  <Form.Group className="mb-3">
                    <Form.Label>Check-in Date</Form.Label>
                    <Form.Control type="date" required value={fromdate} onChange={(e) => setFromdate(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Check-out Date</Form.Label>
                    <Form.Control type="date" required value={todate} onChange={(e) => setTodate(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </Form.Group>

                  <hr />
                  <h6 className="mb-3">Payment Details</h6>
                  <Form.Control type="text" name="cardholdername" placeholder="Cardholder Name" required className="mb-2" onChange={handleCardChange} />
                  <Form.Control type="number" name="cardnumber" placeholder="Card Number" required className="mb-2" onChange={handleCardChange} />
                  
                  <Row>
                    <Col>
                      <Form.Control type="text" name="expmonthyear" placeholder="MM/YY" required className="mb-3" onChange={handleCardChange} />
                    </Col>
                    <Col>
                      <Form.Control type="number" name="cvvcode" placeholder="CVV" required className="mb-3" onChange={handleCardChange} />
                    </Col>
                  </Row>

                  <Button variant="success" type="submit" className="w-100">CONFIRM & PAY</Button>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </SiteLayout>
  );
};

export default BookRoom;
