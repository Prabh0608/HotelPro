import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

const currentYear = new Date().getFullYear();

const SiteLayout = ({ children, user, links = [] }) => {
  const navigate = useNavigate();
  const homePath = user?.userType === "Admin" ? "/adminhome" : user ? "/userhome" : "/";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="site-shell">
      <Navbar expand="lg" className="site-navbar sticky-top">
        <Container>
          <Navbar.Brand as={Link} to={homePath} className="site-brand">
            <span className="site-brand-mark" aria-hidden="true">H</span>
            HotelPro
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="site-navigation" />
          <Navbar.Collapse id="site-navigation">
            <Nav className="ms-auto align-items-lg-center gap-lg-2">
              {user?.name && <span className="site-welcome">Welcome, {user.name}</span>}
              {links.map((link) => (
                <Nav.Link as={Link} to={link.to} key={link.to} className="site-nav-link">
                  {link.label}
                </Nav.Link>
              ))}
              {user ? (
                <Button variant="outline-primary" size="sm" onClick={handleLogout} className="site-nav-button">
                  Sign out
                </Button>
              ) : (
                links.length === 0 && (
                  <>
                    <Nav.Link as={Link} to="/login" className="site-nav-link">Log in</Nav.Link>
                    <Button as={Link} to="/signup" size="sm" className="site-nav-button">Get started</Button>
                  </>
                )
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <Container>
          <div className="site-footer-grid">
            <div>
              <Link to={homePath} className="site-footer-brand">
                <span className="site-brand-mark" aria-hidden="true">H</span>
                HotelPro
              </Link>
              <p className="site-footer-copy">
                A thoughtful place to find your next stay and keep every booking in one place.
              </p>
            </div>
            <div className="site-footer-links">
              <span className="site-footer-heading">Explore</span>
              <Link to="/">Home</Link>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Create an account</Link>
            </div>
            <div className="site-footer-note">
              <span className="site-footer-heading">Your stay, simplified</span>
              <p>Browse rooms, plan your visit, and manage your reservations with ease.</p>
            </div>
          </div>
          <div className="site-footer-bottom">
            <span>© {currentYear} HotelPro</span>
            <span>Made for more memorable stays.</span>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default SiteLayout;
