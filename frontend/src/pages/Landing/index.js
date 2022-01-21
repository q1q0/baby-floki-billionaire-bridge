import React, { useState, useEffect } from 'react';
import "./style.scss"

import { Box, OutlinedInput, InputAdornment } from '@material-ui/core';
import Dropdown from '../../components/Dropdown/Dropdown';

import { HiArrowRight } from 'react-icons/hi';
import BridgePaper from '../../components/BridgePaper/BridgePaper';

import BigNumber from 'bignumber.js';
import BridgeEth from '../../build/contracts/BridgeEth.json';
import BridgeBsc from '../../build/contracts/BridgeBsc.json';
import TokenEth from '../../build/contracts/TokenEth.json';
import TokenBsc from '../../build/contracts/TokenBsc.json';

const decimalNumber = new BigNumber("1000000000000000000");
const bscNetworkId = 97;
const ethNetworkId = 3;
const feeAmount = 2;
let processing = 0;

const Landing = ({ isOpen, setOpen, account, setAccount }) => {

    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(1);

    const [balance, setBalance] = useState(0);
    const [amountValue, setAmountValue] = useState(0)
    const [addressValue, setAddressValue] = useState('0x...')
    const [accountEllipsis, setAccountEllipsis] = useState("Connect Wallet");

    const GetAccount = async () => {
        const a = await window.web3.eth.getAccounts();
        setAccount(a[0]);
    }
    useEffect(() => {
        window.ethereum.on('networkChanged', function (networkId) {
            console.log('networkChanged', networkId, processing);
            setAccount("");
            GetAccount();
            if (!processing) setAmountValue(0);
        });
    }, []);
    useEffect(() => {
        if (account) {
            if (processing === 0)
                setAccountEllipsis("Send");
            setAddressValue(account);
            fetchBalance();
        }
    }, [account])
    const onBridgeEth = async () => {
        const chainId = await window.web3.eth.getChainId();
        if (chainId !== 3) {
            alert("Wrong Network");
            return;
        }
        setAccountEllipsis("Please wait...");
        processing = 1;
        const amount = new BigNumber(amountValue).multipliedBy(decimalNumber).toJSON();
        const amountToApprove = (new BigNumber(amountValue).plus(feeAmount)).multipliedBy(decimalNumber).toJSON();

        const nonce = 1;

        const message = window.web3.utils.soliditySha3(
            { t: 'address', v: account },
            { t: 'address', v: addressValue },
            { t: 'uint256', v: amount },
            { t: 'uint256', v: nonce },
        ).toString('hex');
        const signature = message;
        console.log(amount);
        const bridgeEthAddress = BridgeEth.networks[ethNetworkId].address;
        const tokenEthInstance = await new window.web3.eth.Contract(TokenEth.abi, TokenEth.networks[ethNetworkId].address);
        const bridgeEthInstance = await new window.web3.eth.Contract(BridgeEth.abi, bridgeEthAddress);
        // await tokenEthInstance.methods.approve(bridgeEthAddress, amountToApprove).send({ from: account });

        // await bridgeEthInstance.methods.burn(account, amount, nonce, signature).send({ from: account });
        await bridgeEthInstance.methods.pay().send({ from: account, value: window.web3.utils.toWei(amountValue.toString(), "ether") });
        let ethereum = window.ethereum;
        const data = [{
            chainId: '0x61',
            chainName: 'BSC Testnet',
            nativeCurrency:
            {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
            blockExplorerUrls: ['https://testnet.bscscan.com'],
        }]

        /* eslint-disable */
        const tx = await ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
        if (tx) {
            console.log(tx)
        }
        processing = 2;
        // onBridgeBsc(amountValue);
    }

    const onBridgeBsc = async (amountValue) => {
        const chainId = await window.web3.eth.getChainId();
        if (chainId !== 97) {
            alert("Wrong Network");
            return;
        }
        setAccountEllipsis("Please wait...");
        const amount = new BigNumber(amountValue).multipliedBy(decimalNumber).toJSON();
        const amountToApprove = (new BigNumber(amountValue).plus(feeAmount)).multipliedBy(decimalNumber).toJSON();

        const nonce = 1;
        const bridgeBscAddress = BridgeBsc.networks[bscNetworkId].address;
        const message = window.web3.utils.soliditySha3(
            { t: 'address', v: account },
            { t: 'address', v: addressValue },
            { t: 'uint256', v: amount },
            { t: 'uint256', v: nonce },
        ).toString('hex');
        const signature = message;
        const tokenBscInstance = await new window.web3.eth.Contract(TokenBsc.abi, TokenBsc.networks[bscNetworkId].address);
        const bridgeBscInstance = await new window.web3.eth.Contract(BridgeBsc.abi, bridgeBscAddress);
        // await tokenBscInstance.methods.approve(bridgeBscAddress, amountToApprove).send({ from: account });
        // await bridgeBscInstance.methods.burn(account, amount, nonce, signature).send({ from: account });
        // await tokenBscInstance.methods.startTrading().send({ from: account });
        // await tokenBscInstance.methods.setAllowedTransfer(bridgeBscAddress, true).send({from : account});
        await bridgeBscInstance.methods.mint(bridgeBscAddress, account, amount, nonce, signature).send({ from: account });
        processing = 0;
        setAccountEllipsis("Send");
    }

    const fetchBalance = async () => {
        const chainId = await window.web3.eth.getChainId();
        if (processing / 1 === 2 && chainId / 1 === 97)
            onBridgeBsc(amountValue);
        let value;
        if (chainId === 97) {
            const tokenBscInstance = await new window.web3.eth.Contract(TokenBsc.abi, TokenBsc.networks[bscNetworkId].address);
            value = await tokenBscInstance.methods.balanceOf(account).call();
            console.log("BSC", value);
        }
        if (chainId === 3) {
            value = await window.web3.eth.getBalance(account);
            console.log("ETH", value);
        }
        setBalance(new BigNumber(value).dividedBy(decimalNumber).decimalPlaces(2).toJSON());
    }

    const handleExchange = () => {
        if (!amountValue) {
            alert("Input Correct Amount");
            return;
        }
        if (processing) {
            alert("Please wait processing. Consider your wallet");
            return;
        }

        onBridgeEth(amountValue);
    }

    const handleFromClose = (event) => {
        const t = event.currentTarget.dataset.myValue / 1;
        setFrom(t);
        if (to === t)
            setTo((t + 1) % 2);
    };
    const handleToClose = (event) => {
        const t = event.currentTarget.dataset.myValue / 1;
        setTo(t);
        if (from === t)
            setFrom((t + 1) % 2);
    };
    return (
        <Box className="bridgebody">
            <Box className="bridge">
                <Box>
                    <Box style={{ fontSize: "0.75em" }}>Asset</Box>
                    <Box style={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ width: "40%" }}><Dropdown index={0} /></Box>
                        <Box sx={{ width: "40%" }}><Dropdown index={1} /></Box>
                    </Box>
                </Box>
                <Box className="send">
                    <Box style={{ width: "40%" }}>
                        <Box>From</Box>
                        <BridgePaper index={from} handleClose={handleFromClose} />
                    </Box>
                    <Box className="arrow" className="arrow" >
                        <HiArrowRight />
                    </Box>
                    <Box style={{ width: "40%" }}>
                        <Box>To</Box>
                        <BridgePaper index={to} handleClose={handleToClose} />
                    </Box>
                </Box>
                <Box className="sendetail">If you have not add Binance Smart Chain network in your MetaMask yet, please click <button style={{ color: "black", backgroundColor: "#ef4444", padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Add network</button> and continue</Box>
                <Box className="amount">
                    <Box>Amount</Box>
                    <OutlinedInput className="amountinput" type="number" value={amountValue}
                        endAdornment={
                            <InputAdornment position="start">
                                <div style={{ cursor: "pointer", backgroundColor: "#ef4444", padding: "0px 10px", borderRadius: "10px", fontSize: "30px" }} onClick={() => { setAmountValue(balance) }}>
                                    MAX
                                </div>
                            </InputAdornment>
                        }
                        onKeyPress={(event) => {
                            if ((event?.key === '-' || event?.key === '+')) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => {
                            if (event.target.value < 0)
                                event.target.value = 0;
                            setAmountValue(event.target.value);
                        }} />
                    <Box className="receive">You will receive ≈ {amountValue * 1000000000} <img src="baby-floki-billionaire.jpg" /> BABY FLOKI BILLIONAIRE <span>&nbsp;BEP20</span></Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {!account && <div className="connect" onClick={() => !processing && setOpen(!isOpen)}>{accountEllipsis}</div>}
                    {account && <span className="connect" onClick={() => { if (accountEllipsis === "Send") handleExchange() }}>{accountEllipsis}</span>}
                </Box>
            </Box >
        </Box >

    );
}


export default Landing;