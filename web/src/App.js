import './App.css';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationContext from './context/authentication.context';
import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const App = () => {

  const [account, setAccount] = useState(null);
  const providerRef = useRef();
  const signerRef = useRef();
  const [balance, setBalance] = useState(0);

  useEffect(() => {

    // lấy số dư ví
    async function fetchBalance (address) {
        if (!providerRef.current) return;

        try {
            const balance = await providerRef.current.getBalance(address);
            setBalance(Number(ethers.formatEther(balance)).toFixed(4));
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }

    // check connection tới ví
    async function checkMetaMaskConnection() {
      if (typeof window.ethereum === 'undefined') {
          console.log("MetaMask chưa được cài đặt!");
          return;
      }

      providerRef.current = new BrowserProvider(window.ethereum);
      signerRef.current = await providerRef.current.getSigner();
      const accounts = await providerRef.current.listAccounts();

      if (accounts.length > 0) {
        setAccount(accounts[0].address);

        // lấy số dư
        await fetchBalance(accounts[0].address) 
      }
    }

    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          console.log("User disconnected MetaMask");

          setAccount(null);
          providerRef.current = null;
          signerRef.current = null;
        } else {
          setAccount(accounts[0]);
        }
      });
  } else {
    toast.error('Vui lòng cài đặt ví MetaMask')
  }

    checkMetaMaskConnection();
  }, []);

  return (
    <div className="App">
      <AuthenticationContext.Provider value={{account, setAccount, providerRef, signerRef, balance}}>
        <Outlet />
      </AuthenticationContext.Provider>
    </div>
  );
}

export default App;
