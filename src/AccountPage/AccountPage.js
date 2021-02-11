import React, { useEffect, useState } from 'react'
import {
    Button,
    Container,
    Form,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
    Message
} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import { buildRequestURL, isValidAddress, createTransaction } from '../api';
import Chart from "react-apexcharts";

/**
 * Adapted from: https://github.com/Semantic-Org/Semantic-UI-React/blob/master/docs/src/layouts/FixedMenuLayout.js
 */

AccountPage.propTypes = {
    activeAddress: PropTypes.string.isRequired,
    clearActiveAddress: PropTypes.func.isRequired,
};
export default function AccountPage(props) {
    const history = useHistory();
    const [sendAddress, setSendAddress] = useState("");
    const [sendAmount, setSendAmount] = useState(0);
    const [activeAccountBalance, setActiveAccountBalance] = useState(null)
    const [activeAccountTransactions, setActiveAccountTransactions] = useState([])
    const [sendFormError, setSendFormError] = useState(null);

    useEffect(async () => {
        fetchActiveAccountInfo()
    }, []);

    const fetchActiveAccountInfo = async () => {
        const response = await fetch(buildRequestURL("addresses", props.activeAddress))
        const response_json = await response.json()
        setActiveAccountBalance(response_json["balance"])
        setActiveAccountTransactions(response_json["transactions"])
    }

    const handleLogoutClick = () => {
        props.clearActiveAddress();
        history.push("/");
    }

    const handleSendClick = async () => {
        setSendFormError(null)
        const hasAddressErrors = await validateSendAddress()
        const hasAmountErrors = validateSendAmount()

        if (hasAddressErrors || hasAmountErrors) {
            return
        }
        createTransaction(props.activeAddress, sendAddress, sendAmount)

        // Clear form for next transaction
        setSendAddress("")
        setSendAmount(0)
        fetchActiveAccountInfo()
    }

    const validateSendAddress = async () => {
        if (!sendAddress) {
            setSendFormError("Invalid address provided")
            return true
        }
        if (sendAddress === props.activeAddress) {
            setSendFormError("Cannot send funds to yourself")
            return true
        }
        const addressExists = await isValidAddress(sendAddress)
        if (!addressExists) {
            setSendFormError("Address does not exist")
            return true
        }
        return false
    }

    const validateSendAmount = () => {
        if (sendAmount <= 0) {
            setSendFormError("Invalid amount")
            return true
        }
        if (parseFloat(sendAmount) > parseFloat(activeAccountBalance)) {
            setSendFormError("You can't spend what you don't got.")
            return true
        }
        return false
    }
    console.log(activeAccountTransactions)
    const renderBalanceGraph = () => {
        // Adapted from: https://apexcharts.com/react-chart-demos/line-charts/stepline/
        const series = [{
            data: activeAccountTransactions.reduce((balances, transaction) => {
                const prevBalance = balances.length === 0 ? 0 : balances[balances.length - 1]
                if (transaction.toAddress === props.activeAddress) {
                    // money coming in
                    balances.push(prevBalance + parseFloat(transaction.amount))
                } else {
                    // money going out
                    balances.push(prevBalance - parseFloat(transaction.amount))
                }
                return balances;
            }, [])
        }]
        const options = {
            chart: {
                type: 'line',
                height: 350
            },
            stroke: {
                curve: 'stepline',
            },
            dataLabels: {
                enabled: false
            },
            title: {
                text: 'JobCoin Balance',
                align: 'left'
            },
            markers: {
                hover: {
                    sizeOffset: 4
                }
            }
        }
        return <Chart options={options} series={series} type="line" height={350} />
    }

    return (
        <div>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item header>
                        Jobcoin Sender
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        <Menu.Item>Logged in as: {props.activeAddress}</Menu.Item>
                        <Menu.Item as="a" onClick={handleLogoutClick}>Signout</Menu.Item>
                    </Menu.Menu>
                </Container>
            </Menu>

            <Segment style={{ padding: '8em 0em' }} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Form size='large'>
                                <Segment>
                                    <Header as='h2'>JobCoin Balance</Header>
                                    <Header as='h2'>{activeAccountBalance}</Header>
                                </Segment>
                            </Form>
                            <Form size='large' style={{ padding: '2em 0em' }}>
                                <Segment>
                                    <Header as='h2'>Send JobCoin</Header>
                                    <Header as='h5'>Destination Address</Header>
                                    <Form.Input fluid error={!!sendFormError} icon='user' iconPosition='left' placeholder='Jobcoin Address' value={sendAddress} onChange={event => setSendAddress(event.target.value)} />
                                    <Header as='h5'>Amount to send</Header>
                                    <Form.Input fluid error={!!sendFormError} icon='money' iconPosition='left' placeholder='Jobcoin amount' value={sendAmount} onChange={event => setSendAmount(event.target.value)} type="number" />
                                    {sendFormError && <Message>{sendFormError}</Message>}
                                    <Grid divided>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Button color='teal' disabled={sendAddress === "" || sendAmount === 0} fluid size='large' onClick={handleSendClick}>
                                                    Send
                                            </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Form>
                        </Grid.Column>
                        <Grid.Column floated='right' width={12}>
                            {renderBalanceGraph()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    )
}