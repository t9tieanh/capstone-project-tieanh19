import './style.scss';
import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '~/context/authentication.context';
import callContractService from '~/service/callContract.service';
import { Card, Container, Row, Col } from 'react-bootstrap';
import PrimaryButton from '~/components/common/button/btn-primary';
import { FaEthereum } from "react-icons/fa6";

const WalletBalance = () => {

    const { balance, account, providerRef } = useContext(AuthenticationContext);
    
    const [myTokenCount, setMyTokenCount] = useState(0)

    useEffect(() => {
        const fetchgetBalance = async () => {
            setMyTokenCount(await callContractService.getBalanceOf(providerRef.current, account))
        }

        fetchgetBalance()
    }, [])

    return (
        <Container className="wallet-balance">
          <div className='d-flex flex-column align-items-center justify-content-center w-100 content gap-5'>
            <div>
                <Card.Title className="text-light fw-bold">Số NFT hiện có</Card.Title>
            </div>
            <div>
                <Card.Text className="fs-4 fw-bold text-light token-count">
                    {myTokenCount} NFT <FaEthereum />
                </Card.Text>
            </div>
          </div>
        </Container>
    );
}

export default WalletBalance;   