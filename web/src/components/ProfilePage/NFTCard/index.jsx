import './style.scss';
import Card from 'react-bootstrap/Card';
import Button  from '~/components/common/button/btn-primary';
import { MdGeneratingTokens } from "react-icons/md";
import callContractService from '~/service/callContract.service';
import { useEffect, useContext } from 'react';
import authenticationContext from '~/context/authentication.context';
import axios from 'axios';
import { useState } from 'react';

const NFTCard = ({ nftId }) => {

    const { providerRef } = useContext(authenticationContext);
    const [nftData, setNftData] = useState(null);

    useEffect(() => {
        const fetchNFTData = async () => {
            try {
                const nftDataUrl = await callContractService.getTokenURI(providerRef.current, nftId);
                const nftData = await axios.get(nftDataUrl);
                console.log("NFT Data:", nftData);
                // Update state or perform actions with nftData

                if (nftData && nftData.data && nftData.status === 200) {
                    // Assuming nftData.data contains the necessary information
                    // You can set state or do something with the data here
                    setNftData(nftData.data);
                }
            } catch (error) {
                console.error("Error fetching NFT data:", error);
            }
        };

        fetchNFTData();
    }, [])

    return (
        <Card style={{ width: '18rem' }} className='mt-4 nft-card shadow-5'>
        <Card.Img variant="top" className='nft-image' width={278} height={278} src={nftData?.image} />
        <Card.Body>
            <Card.Title>{nftData?.name}</Card.Title>
            <Card.Text>
            {                
                nftData?.description || "No description available"
            }
            </Card.Text>
            <Button className={'nft-button'} icon={<MdGeneratingTokens/>} variant="primary">Token{nftData.id}</Button>
        </Card.Body>
        </Card>
    );
}

export default NFTCard;