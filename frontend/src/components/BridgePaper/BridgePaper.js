import React, { useState } from 'react';
import "./style.scss"
import { Box, Paper, Menu, MenuItem } from '@material-ui/core';
import { FaChevronDown } from 'react-icons/fa'

export default function BridgePaper({children, index, handleClose}) {
    const networks = ["Ethereum Network", "Binance Chain Network"];
    const networkimags = ["eth-icon.svg", "chain-icon.svg"];
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    return (
        <Paper elevation={5} className="paper">
            <img src={networkimags[index]} />
            <Box className="main">
                <Box>{networks[index]}</Box>
                <Box className="arrowdown" onClick={handleClick}><FaChevronDown /></Box>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => { setAnchorEl(null) }}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {index === 0 && <MenuItem onClick={(event) => { handleClose(event); setAnchorEl(null) }} data-my-value={0}>Ethereum Network</MenuItem>}
                    {index === 1 && <MenuItem onClick={(event) => { handleClose(event); setAnchorEl(null) }} data-my-value={1}>Binance Chain Network</MenuItem>}
                </Menu>
            </Box>
        </Paper>
    );
}


export { BridgePaper };