import React from 'react';
import { Link } from 'react-router-dom';

// Adapted from: https://ultimatecourses.com/blog/react-router-not-found-component

const NotFound = () => (
    <div>
        <h1>404 - Not Found!</h1>
        <Link to="/">
            Go to Login
        </Link>
    </div>
);

export default NotFound;