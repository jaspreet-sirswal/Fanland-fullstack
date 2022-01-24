import React, { useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [errorState, setErrorState] = useState("");
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/signin" } };

  const togglePasswordVisibility = () => {
    var passwordField = document.getElementById("userpassword");
    if (passwordField.type === "password") passwordField.type = "text";
    else passwordField.type = "password";
  };

  const signup = (e) => {
    e.preventDefault();
    auth.signup(
      { user_name: userName, user_password: userPassword, email: userEmail },
      { user_name: userName },
      () => {
        history.replace(from);
      },
      () => {
        setErrorState("error-auth");
        setUserName("");
        setEmail("");
        setPassword("");
      }
    );
  };

  return (
    <div
      style={{ backgroundColor: "black", height: "100vh" }}
      className="text-white"
    >
      <div className="container">
        <p>SignIn</p>
        {errorState === "" ? (
          <p></p>
        ) : (
          <p className="err-mssg">Username already in use.</p>
        )}
        <form onSubmit={signup} className="mt-3 col-5">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              required
              type="text"
              className={`form-control ${errorState}`}
              id="username"
              placeholder="Your Username"
              value={userName}
              onFocus={() => setErrorState("")}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              className={`form-control ${errorState}`}
              id="email"
              placeholder="Your Email"
              value={userEmail}
              onFocus={() => setErrorState("")}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="userpassword">Password</label>
            <input
              required
              type="password"
              className={`form-control ${errorState}`}
              id="userpassword"
              placeholder="Password"
              value={userPassword}
              onFocus={() => setErrorState("")}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-group form-check mt-2">
            <input
              type="checkbox"
              onClick={togglePasswordVisibility}
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Show Password
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            SignUp
          </button>
        </form>
        <div className="mt-3">
          <Link to="/signin">SignIn</Link>
        </div>
      </div>
    </div>
  );
}
