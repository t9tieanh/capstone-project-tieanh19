import { use, useEffect, useState } from 'react';
import './style.scss';
import { ethers } from 'ethers';

const WalletBalance = ({provider, account}) => {

    const [balance, setBalance] = useState(0);

    console.log("Provider in WalletBalance:", provider);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!provider) return;

            try {
                const balance = await provider.getBalance(account);
                setBalance(Number(ethers.formatEther(balance)).toFixed(4));
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        fetchBalance();
    }, [])

    return (
        <div className="wallet-balance mx-auto">
            <h3 className='text-center'>Wallet Balance {balance} $</h3>
            
        </div>
    );
}

export default WalletBalance;   