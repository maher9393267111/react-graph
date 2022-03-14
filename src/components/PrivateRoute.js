import React, { useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import LoadingRedirect from './LoadingRedirect'
const PrivateRoute = ({ children, ...rest }) => {
    const { state } = useContext(AuthContext);
    const [user, setUser] = useState(false);

    useEffect(() => {
        if (state.user) {
            setUser(true);
        }
    }, [state.user]);

    const navLinks = () => (
        <nav>
            <ul className="nav flex-column"

          >
                <li className="nav-item">
                    <Link style={{color:'#265667'}} className="nav-link" to="/profile">
                        Profile
                    </Link>
                </li>
                <li className="nav-item">
                    <Link style={{color:'#265667'}} className="nav-link" to="/password/update">
                        Password
                    </Link>
                </li>
                <li className="nav-item">
                    <Link style={{color:'#265667'}} className="nav-link" to="/create/post">
                        Post
                    </Link>
                </li>
            </ul>
        </nav>
    );

    const renderContent = () => (
        <div className="container-fluid pt-5">
            <div className="row">
                <div className="col-md-4">{navLinks()}</div>
                <div className="col-md-8">
                    <Route {...rest} />
                </div>
            </div>
        </div>
    );

    return user ? renderContent() : <h4><LoadingRedirect path="/login" /></h4>;
};

export default PrivateRoute;
