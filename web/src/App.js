import './App.css';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationContext from './context/authentication.context';
import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { useEffect, useRef } from 'react';

const App = () => {

  const [account, setAccount] = useState(null);
  const providerRef = useRef();
  const signerRef = useRef();

  useEffect(() => {
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
      }
    }

    // Lắng nghe sự kiện khi người dùng kết nối hoặc ngắt kết nối MetaMask
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        console.log("User disconnected MetaMask");

        // Reset account and provider if no accounts are available
        setAccount(null);
        providerRef.current = null;
        signerRef.current = null;
      } else {
        setAccount(accounts[0]);
      }
    });

    checkMetaMaskConnection();
  }, []);

  return (
    <div className="App">
      <AuthenticationContext.Provider value={{account, setAccount, providerRef, signerRef}}>
        <Outlet />
      </AuthenticationContext.Provider>
    </div>
  );
}

export default App;
