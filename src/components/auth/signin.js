import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function SignIn() {
  const [userName, setUserName] = useState("");
  const [userPassword, setPassword] = useState("");
  const [errorState, setErrorState] = useState("");
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };

  let login = (e) => {
    e.preventDefault();
    auth.signin(
      userName,
      userPassword,
      () => {
        history.replace(from);
      },
      () => {
        setErrorState("error-auth");
        setUserName("");
        setPassword("");
      }
    );
  };

  const togglePasswordVisibility = () => {
    var passwordField = document.getElementById("exampleInputPassword1");
    if (passwordField.type === "password") passwordField.type = "text";
    else passwordField.type = "password";
  };

  return (
    <div style={{ backgroundColor: "black" , height: "100vh"}} className="text-white ">
      <div className="container">
        <p>SignIn</p>
        {errorState === "" ? (
          <p></p>
        ) : (
          <p className="err-mssg">Username or password is incorrect.</p>
        )}
        <form onSubmit={login} className="mt-3 col-5">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Username</label>
            <input
              type="text"
              className={`form-control ${errorState}`}
              id="exampleInputEmail1"
              placeholder="Your Username"
              value={userName}
              onFocus={() => setErrorState("")}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="form-group mt-2">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              type="password"
              className={`form-control ${errorState}`}
              id="exampleInputPassword1"
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
            SignIn
          </button>
        </form>
        <div className="mt-3">
          <Link to="/signup">SignUp</Link>
        </div>
      </div>
    </div>
  );
}
