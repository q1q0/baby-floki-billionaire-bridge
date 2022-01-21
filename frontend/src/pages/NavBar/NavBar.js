import React from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector'
import { Box } from '@material-ui/core';
import './style.scss';

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
})

export default function NavBar({ account, setAccount, isOpen, setOpen }) {

    const accountEllipsis = account ? account : null;
    return (
        <Box className="navbar">
            <Box className="navbarbody">
                <Box className="logobody">
                    <img src="baby-floki-billionaire.jpg" />
                    <Box className="logotitle">
                        BABY FLOKI BILLIONAIRE <span style={{ fontWeight: "500" }}>BRIDGE</span>
                    </Box>
                </Box>
                {account ?
                    (
                        <button className="navconnect">
                            {accountEllipsis}
                        </button>
                    ) : (
                        <button onClick={() => setOpen(!isOpen)} className="navconnect" >
                            Connect Wallet
                        </button>
                    )
                }
            </Box>
        </Box>
    );
}
