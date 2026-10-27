import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import SiteLayout from "./SiteLayout";
import { API_URL } from "../../config";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/Login`, formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      alert(res.data.msg);
      
      if (res.data.user.userType === "Admin") {
        navigate("/adminhome");
      } else {
        navigate("/userhome");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <SiteLayout links={[{ label: "Create an account", to: "/signup" }]}>
      <div className="site-auth-wrap">
        <Card className="site-auth-card">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="site-eyebrow">Welcome back</span>
              <h1 className="site-heading h2 mt-2">Log in to HotelPro</h1>
              <p className="site-subheading mb-0">Pick up where your next stay begins.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="you@example.com" required onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
              </Form.Group>
              <Button type="submit" className="w-100 py-2">Log in</Button>
            </Form>
            <p className="text-center text-secondary mt-4 mb-0">
              New to HotelPro? <Link to="/signup" className="fw-semibold">Create an account</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </SiteLayout>
  );
};

export default Login;
