import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Main from "./components/main";
import "./index.css";
import { ProvideAuth, useAuth } from "./components/auth/useAuth";
import SignIn from "./components/auth/signin";
import SignUp from "./components/auth/signup";

function App() {
  return (
    <ProvideAuth>
      <>
        <Router>
          <Switch>
            <Route exact path="/">
              <Redirect to="/app" />
            </Route>
            <PrivateRoute path="/app">
              <Main />
            </PrivateRoute>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
          </Switch>
        </Router>
      </>
    </ProvideAuth>
  );
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return auth.user ? (
          children
        ) : (
          <Redirect to={{ pathname: "/signin", state: { from: location } }} />
        );
      }}
    ></Route>
  );
}

export default App;
