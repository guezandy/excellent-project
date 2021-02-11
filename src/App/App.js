import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import LoginPage from '../LoginPage/LoginPage'
import AccountPage from '../AccountPage/AccountPage'
import NotFound from '../NotFound/NotFound'

export default function App() {
    let [activeAddress, setAppActiveAddress] = useState(localStorage.getItem("activeAddress", ""));

    const handleAppActiveAddressChange = address => {
        localStorage.setItem('activeAddress', address);
        setAppActiveAddress(address);
    }

    return (
        <Router>
            <Switch>
                <Route exact path={"/"}>
                    <LoginPage onLogin={handleAppActiveAddressChange} />
                </Route>
                {/* Only render this route if an active address is present */}
                {activeAddress && (
                    <Route exact path="/account">
                        <AccountPage activeAddress={activeAddress} clearActiveAddress={() => handleAppActiveAddressChange("")} />
                    </Route>
                )}
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
}
