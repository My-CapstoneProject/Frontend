import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  MainContainer,
  SignInContainer,
  SignUpContainer,
  Form,
  Title,
  Input,
  Button,
  GhostButton,
  OverlayContainer,
  Overlay,
  LeftOverlayPanel,
  RightOverlayPanel,
  Select,
} from "./StyledComponents";
import "./Auth.css";
import { authService } from "../../services/api";

const Login = () => {
  const [signIn, setSignIn] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "ADMIN",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const user = await login(formData);
      navigate(
        user.role === "ADMIN" ? "/admin/dashboard" : "/shopkeeper/dashboard"
      );
    } catch (err) {
      setError("Failed to sign in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await authService.signup({
        username: formData.username,
        password: formData.password,
        role: "SHOPKEEPER",
      });
      setSignIn(true);
      setFormData({ username: "", password: "", role: "ADMIN" });
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <MainContainer>
        <SignInContainer signingIn={signIn}>
          <Form onSubmit={handleSignIn}>
            <Title>Sign In</Title>
            {error && <div className="error-message">{error}</div>}
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="ADMIN">Admin</option>
              <option value="SHOPKEEPER">Shopkeeper</option>
            </Select>
            <Button type="submit" disabled={loading}>
              Sign In
            </Button>
          </Form>
        </SignInContainer>

        <SignUpContainer signingIn={signIn}>
          <Form onSubmit={handleSignUp}>
            <Title>Create Account</Title>
            {error && <div className="error-message">{error}</div>}
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" disabled={loading}>
              Sign Up
            </Button>
          </Form>
        </SignUpContainer>

        <OverlayContainer signingIn={signIn}>
          <Overlay signingIn={signIn}>
            <LeftOverlayPanel signingIn={signIn}>
              <Title>Welcome Back!</Title>
              <GhostButton onClick={() => setSignIn(true)}>Sign In</GhostButton>
            </LeftOverlayPanel>

            <RightOverlayPanel signingIn={signIn}>
              <Title>Hello, Friend!</Title>
              <GhostButton onClick={() => setSignIn(false)}>
                Sign Up
              </GhostButton>
            </RightOverlayPanel>
          </Overlay>
        </OverlayContainer>
      </MainContainer>
    </Container>
  );
};

export default Login;
