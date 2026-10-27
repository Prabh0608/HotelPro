import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import SiteLayout from "./SiteLayout";

const sampleRooms = [
  {
    name: "Garden Deluxe",
    type: "Deluxe",
    capacity: 2,
    price: 4200,
    description: "A calm, light-filled room with a king bed and a garden view.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=90",
    alt: "Bright deluxe hotel room with a king bed",
  },
  {
    name: "City Comfort",
    type: "Standard",
    capacity: 2,
    price: 2800,
    description: "A welcoming city retreat with considered details and room to unwind.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=90",
    alt: "Modern hotel room with soft natural light",
  },
  {
    name: "Family Suite",
    type: "Suite",
    capacity: 4,
    price: 6500,
    description: "Extra space to settle in, with a separate area to spend time together.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=90",
    alt: "Warm contemporary suite interior",
  },
];

const Home = () => (
  <SiteLayout>
    <section className="site-hero">
      <img
        className="site-hero-image"
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=92"
        alt="A welcoming hotel surrounded by greenery"
        fetchPriority="high"
      />
      <div className="site-hero-overlay" />
      <Container className="site-hero-content">
        <span className="site-eyebrow">A better way to get away</span>
        <h1 className="site-hero-title">Make room for a memorable stay.</h1>
        <p className="site-hero-copy">
          Find a space to slow down, explore somewhere new, and feel at home while you’re away.
        </p>
        <div className="d-flex flex-wrap gap-3 mt-4">
          <Button as={Link} to="/signup" variant="light">Find your stay</Button>
          <Button as={Link} to="/login" variant="outline-light">Log in</Button>
        </div>
      </Container>
    </section>

    <Container className="pb-4">
      <section className="site-section" id="rooms">
        <Row className="align-items-end mb-4">
          <Col md={8}>
            <span className="site-eyebrow">A little inspiration</span>
            <h2 className="site-heading display-6 mt-2 mb-2">Explore stays made for you</h2>
            <p className="site-subheading mb-0">
              Take a look at a few sample rooms to get a feel for your next stay.
            </p>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <span className="badge rounded-pill text-bg-light border px-3 py-2">Sample listings</span>
          </Col>
        </Row>

        <Row className="g-4">
          {sampleRooms.map((room) => (
            <Col md={4} key={room.name}>
              <Card className="site-card site-room-card h-100">
                <Card.Img
                  className="site-card-image"
                  variant="top"
                  src={room.image}
                  alt={room.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ height: "250px" }}
                />
                <Card.Body className="d-flex flex-column p-4">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <span className="site-eyebrow">{room.type}</span>
                    <span className="text-secondary small">Up to {room.capacity} guests</span>
                  </div>
                  <Card.Title className="h5">{room.name}</Card.Title>
                  <Card.Text className="site-subheading">{room.description}</Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center gap-2 pt-2">
                    <span className="fw-bold">₹{room.price.toLocaleString("en-IN")} <small className="text-secondary fw-normal">/ night</small></span>
                    <Button as={Link} to="/signup" variant="outline-primary" size="sm">View stay</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="site-section">
        <Row className="justify-content-center text-center mb-4">
          <Col lg={7}>
            <span className="site-eyebrow">A stay, made simpler</span>
            <h2 className="site-heading display-6 mt-2">From browsing to booked</h2>
            <p className="site-subheading">Everything you need to plan and keep track of your visit.</p>
          </Col>
        </Row>
        <Row className="g-4">
          {[
            ["01", "Choose your room", "Compare room types, guest capacity, and nightly rates."],
            ["02", "Plan your dates", "Choose your stay dates and review your reservation details."],
            ["03", "Keep it all together", "Check your bookings and manage them from your account."],
          ].map(([number, title, text]) => (
            <Col md={4} key={number}>
              <Card className="site-card h-100 border-0">
                <Card.Body className="p-4">
                  <span className="site-feature-icon">{number}</span>
                  <Card.Title className="h5">{title}</Card.Title>
                  <Card.Text className="site-subheading mb-0">{text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  </SiteLayout>
);

export default Home;
