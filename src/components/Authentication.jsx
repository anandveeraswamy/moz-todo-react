import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, register as apiRegister } from "../services/api";

const AuthForm = ({ onSubmit, fields, submitButtonText }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("AuthForm submission error:", error);
      
      // Extract detailed error message from API response
      if (error.response?.data) {
        const errorData = error.response.data;
        // Convert error object to readable message
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) => {
            const messageArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${messageArray.join(", ")}`;
          })
          .join("; ");
        setError(errorMessages || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p className="error-message">{error}</p>}
      {fields.map((field) => (
        <input
          key={field.name}
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          required={field.required}
          className="input__lg"
        />
      ))}
      <button type="submit" className="btn btn__primary btn__lg">{submitButtonText}</button>
    </form>
  );
};

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const data = await apiLogin(formData.username, formData.password);
    login(data.access, data.refresh, formData.username);
    navigate("/todos");
  };

  const fields = [
    {
      name: "username",
      type: "text",
      placeholder: "Username",
      required: true,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      required: true,
    },
  ];

  return (
    <div className="todoapp stack-large">
      <h1>Login</h1>
      <AuthForm
        onSubmit={handleSubmit}
        fields={fields}
        submitButtonText="Login"
      />
    </div>
  );
};

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await apiRegister(formData.username, formData.email, formData.password);
    const loginData = await apiLogin(formData.username, formData.password);
    login(loginData.access, loginData.refresh, formData.username);
    navigate("/todos");
  };

  const fields = [
    {
      name: "username",
      type: "text",
      placeholder: "Username",
      required: true,
    },
    { name: "email", type: "email", placeholder: "Email", required: true },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      required: true,
    },
  ];

  return (
    <div className="todoapp stack-large">
      <h1>Register</h1>
      <AuthForm
        onSubmit={handleSubmit}
        fields={fields}
        submitButtonText="Register"
      />
    </div>
  );
};