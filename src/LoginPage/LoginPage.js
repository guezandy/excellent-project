import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { buildRequestURL, isValidAddress } from '../api';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';

/**
 * Adapted from:
 * https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/LoginLayout.js
 */

LoginPage.propTypes = {
    onLogin: PropTypes.func.isRequired,
};
export default function LoginPage(props) {
    const history = useHistory();
    const [address, setAddress] = useState("")
    const [invalidAddress, setInvalidAddress] = useState(false)

    const resetErrorElements = () => {
        setInvalidAddress(false)
    }

    const _handleLoginClick = async () => {
        resetErrorElements();

        const addressExists = await isValidAddress(address)
        if (!addressExists) {
            setInvalidAddress(true)
        } else {
            // We have a valid address redirect
            props.onLogin(address)
            history.push("/account");
        }
    }

    // Thought i'd be a good idea to include a sign up link 
    // if they've entered an invalid address they can click sign up to register
    const _handleSignupClick = async () => {
        resetErrorElements();

        // Build form data to pass to API
        let formData = new FormData();
        formData.append('address', address);
        await fetch("http://jobcoin.gemini.com/pried-stuffing/create", { method: "POST", body: formData, mode: 'no-cors' });
        // We have a valid address redirect
        props.onLogin(address)
        history.push("/account");
    }

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Welcome! Sign in with your jobcoin address
                </Header>
                <Form size='large'>
                    <Segment stacked>
                        <Form.Input error={invalidAddress} fluid icon='user' iconPosition='left' placeholder='Jobcoin Address' value={address} onChange={event => setAddress(event.target.value)} />
                        {invalidAddress && <Message>Invalid address provided, to sign up with that address click sign up</Message>}

                        <Grid columns={invalidAddress ? 2 : 1} divided>
                            <Grid.Row>
                                <Grid.Column>
                                    <Button color='teal' disabled={address === ""} fluid size='large' onClick={_handleLoginClick}>
                                        Login
                                    </Button>
                                </Grid.Column>
                                {invalidAddress && (
                                    <Grid.Column>
                                        <Button color='teal' fluid size='large' onClick={_handleSignupClick}>
                                            Sign up
                                        </Button>
                                    </Grid.Column>
                                )}
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    )
}

