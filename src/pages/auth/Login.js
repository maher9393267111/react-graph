import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { gql, useMutation } from "@apollo/client";
import Form from "../../components/forms/AuthForm";

const USER_CREATE = gql`
  mutation userCreate {
    userCreate {
      username
      email
    }
  }
`;

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("gqlreactnode@gmail.com");
  const [password, setPassword] = useState("gggggg");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  let history = useHistory();

  // mutation create user
  const [userCreate] = useMutation(USER_CREATE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          const { user } = result;
          const idTokenResult = await user.getIdTokenResult();

          dispatch({
            type: "LOGGED_IN_USER",
            payload: { email: user.email, token: idTokenResult.token },
          });

          // send user info to our server mongodb to either update/create
          userCreate();
          history.push("/profile");
        });
    } catch (error) {
      console.log("login error", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  //sign with google

  const googleLogin = () => {
    auth.signInWithPopup(googleAuthProvider).then(async (result) => {
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      dispatch({
        type: "LOGGED_IN_USER",
        payload: { email: user.email, token: idTokenResult.token },
      });

      // send user info to our server mongodb to either update/create

      userCreate();
      history.push("/profile");
    });
  };

  return (
    <div className="contianer p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Login</h4>}
      <button onClick={googleLogin} className="btn btn-raised btn-danger mt-5">
        Login with Google
      </button>

      <Form
        handleSubmit={handleSubmit}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        loading={loading}
        setLoading={setLoading}
        showPasswordInput= {true}
      />
       <Link className="text-danger float-right" to="/password/forgot">
                Forgot Password
            </Link>

     
    </div>
  );
};

export default Login;

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

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter password"
                        disabled={loading}
                    />
                </div>

                <button className="btn btn-raised btn-primary" disabled={!email || !password || loading}>
                    Submit
                </button>
            </form> */}