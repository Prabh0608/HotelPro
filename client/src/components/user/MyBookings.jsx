import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import SiteLayout from "../common/SiteLayout";
import { API_URL } from "../../config";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchBookings = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/bookings/getuserbookings`, { userid: user.id });
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingid) => {
    try {
      await axios.post(`${API_URL}/api/bookings/cancelbooking`, { bookingid });
      alert("Booking cancelled successfully");
      fetchBookings(); // Refresh the list to show the new status
    } catch (error) {
      alert("Error cancelling booking");
    }
  };

  return (
    <SiteLayout user={user} links={[{ label: "Browse rooms", to: "/userhome" }]}>
      <Container className="site-content site-page">
        <div className="mb-4">
          <span className="site-eyebrow">Your travel plans</span>
          <h1 className="site-heading display-6 mt-2">My bookings</h1>
          <p className="site-subheading mb-0">Review your stays and keep your plans close.</p>
        </div>
        <Row className="justify-content-center">
          {bookings.map(booking => (
            <Col md={8} key={booking._id} className="mb-3">
              <Card className="site-card">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title className="mb-0 text-capitalize">{booking.type} Room</Card.Title>
                    <Badge bg={booking.status === 'cancelled' ? 'danger' : 'success'}>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </div>
                  <hr />
                  <p className="mb-1"><strong>Booking ID:</strong> {booking._id}</p>
                  <p className="mb-1"><strong>From:</strong> {booking.fromdate} | <strong>To:</strong> {booking.todate}</p>
                  <p className="mb-1"><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                  
                  {booking.status !== 'cancelled' && (
                    <Button 
                      variant="outline-danger" 
                      className="w-100 mt-3"
                      onClick={() => cancelBooking(booking._id)}
                    >
                      CANCEL BOOKING
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
          {bookings.length === 0 && (
            <Col md={8}>
              <Card className="site-card border-0">
                <Card.Body className="p-5 text-center">
                  <h2 className="site-heading h4">Nothing booked yet</h2>
                  <p className="site-subheading">Your next memorable stay could be just around the corner.</p>
                  <Button onClick={() => navigate("/userhome")}>Explore rooms</Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </SiteLayout>
  );
};

export default MyBookings;
