import React, { useState, useEffect,useContext } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
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


const CompleteRegistration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { state,dispatch } = useContext(AuthContext);
    let history = useHistory();

    const [userCreate] = useMutation(USER_CREATE);


    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'));
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // validation
        if (!email || !password) {
            toast.error('Email and password is required');
            return;
        }
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            //  console.log(result);
            //  console.log('result <<<<<<<<<<<<<<<<<<')
            if (result.user.emailVerified) {
                // remove email from local storage
                window.localStorage.removeItem('emailForRegistration');
                let user = auth.currentUser;
                // console.log('user',user)
                await user.updatePassword(password);

           
   // dispatch user with token and email
                // then redirect
                const idTokenResult = await user.getIdTokenResult();
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }
                });
                // make api request to save/update user in mongodb

console.log(state.user)

userCreate();


                history.push('/profile');



            }
        } catch (error) {
            console.log('register complete error', error.message);
            setLoading(false);
            toast.error(error.message);
        }
    };

    return (
        <div className="contianer p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Register</h4>}

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




            {/* <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter email"
                        disabled
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
                <button className="btn btn-raised btn-primary" disabled={!email || loading}>
                    Submit
                </button>
                
            </form> */}

            {/* <h1>{state.user}</h1> */}
        </div>
    );
};

export default CompleteRegistration;
