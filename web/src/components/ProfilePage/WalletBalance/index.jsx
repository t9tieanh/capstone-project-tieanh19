import './style.scss';
import { useContext } from 'react';
import AuthenticationContext from '~/context/authentication.context';

const WalletBalance = () => {

    const { balance } = useContext(AuthenticationContext);

    return (
        <div className="wallet-balance mx-auto">
            <h3 className='text-center'>Wallet Balance {balance} $</h3>
        </div>
    );
}

export default WalletBalance;   