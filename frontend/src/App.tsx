import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from 'styled-components';
import Landing from './pages/Landing';
import Footer from './pages/Footer/Footer';
import NavBar from './pages/NavBar/NavBar';
import ConnectModal from './components/ConnectModal';
import { useWeb3React } from '@web3-react/core';

import useAuth from './hooks/useAuth';

function App() {
  const [isOpen, setOpen] = useState(false);
  const { login, logout } = useAuth()
  const [account, setAccount] = useState();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "spaceBetween", height: "100vh" }}>
      <NavBar account={account} isOpen={isOpen} setOpen={setOpen} setAccount={setAccount} />
      <Router>
        <Switch>
          <Route exact path="/">
            <Landing isOpen={isOpen} setOpen={setOpen} account={account} setAccount={setAccount} />
            <ConnectModal login={login} open={isOpen} setOpen={setOpen} account={account} setAccount={setAccount} />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

const Background = styled.div`
  z-index: -2;
  position: absolute;
  width: 100%; height: 100%;
  background-color: rgb(245, 245, 245);
`

export default App;
