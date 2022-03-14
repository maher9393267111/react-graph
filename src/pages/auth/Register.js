import React, { useState } from "react";
import { auth } from "../../firebase";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../../components/forms/AuthForm";
const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    // console.log("ENV --->", process.env.REACT_APP_REGISTER_REDIRECT_URL);
    const config = {
      //    url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      handleCodeInApp: true,
    };

    await auth.sendSignInLinkToEmail(email, config);
    toast.success(
      `Email is sent to ${email}. Click the link to complete your registration.`
    );
    // save user email in local storage
    window.localStorage.setItem("emailForRegistration", email);
    // clear state
    setEmail("");
    setLoading(false);
  };

  return (
    <div className="contianer p-5">
      {loading ? (
        <h1 className="text-danger">loading.....</h1>
      ) : (
        <h1>Register</h1>
      )}
      <h4>Register</h4>

      <Form
        handleSubmit={handleSubmit}
        email={email}
        // password={password}
        //  setPassword={setPassword}
        setEmail={setEmail}
        loading={loading}
        setLoading={setLoading}
        showPasswordInput={false}
      />

      {/* <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter email"
                        disabled={loading}
                    />
                </div>
                <button className="btn btn-raised btn-primary" disabled={!email || loading}>
                    Submit
                </button>
            </form> */}
    </div>
  );
};

export default Register;
