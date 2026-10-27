import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import SiteLayout from "./SiteLayout";
import { API_URL } from "../../config";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", c_password: "", phone: "", userType: "Ordinary"
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.c_password) {
      return alert("Passwords do not match!");
    }
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/SignUp`, formData);
      alert(res.data.msg);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <SiteLayout links={[{ label: "Log in", to: "/login" }]}>
      <div className="site-auth-wrap">
        <Card className="site-auth-card">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="site-eyebrow">Start your next journey</span>
              <h1 className="site-heading h2 mt-2">Create your account</h1>
              <p className="site-subheading mb-0">Join HotelPro to browse and manage your stays.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Your name" required onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="you@example.com" required onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="number" name="phone" placeholder="Enter mobile number" required onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Account type</Form.Label>
                <Form.Select name="userType" onChange={handleChange}>
                  <option value="Ordinary">Customer</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Create a password" required onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control type="password" name="c_password" placeholder="Enter your password again" required onChange={handleChange} />
              </Form.Group>
              <Button type="submit" className="w-100 py-2">Create account</Button>
            </Form>
            <p className="text-center text-secondary mt-4 mb-0">
              Already have an account? <Link to="/login" className="fw-semibold">Log in</Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </SiteLayout>
  );
};

export default SignUp;
