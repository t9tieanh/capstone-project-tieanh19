import './style.scss';
import Card from 'react-bootstrap/Card';
import callContractService from '~/service/callContract.service';
import { useEffect, useContext } from 'react';
import authenticationContext from '~/context/authentication.context';
import axios from 'axios';
import { useState } from 'react';
import Tag from '~/components/common/tag';
import PrimaryButton from '~/components/common/button/btn-primary';
import { IoSearchCircle } from "react-icons/io5";
import logo from '~/assets/anonymous-icon-3.jpg'
import React from 'react';
import { contractAddress } from '~/config/contract';

const NFTCard = ({ nftId, handleClickDetailNFT }) => {

    const { account, providerRef } = useContext(authenticationContext);
    const [nftData, setNftData] = useState(null);
    console.log(1)

    useEffect(() => {
        const fetchNFTData = async () => {
            try {
                const nftDataUrl = await callContractService.getTokenURI(providerRef.current, nftId);
                const nftData = await axios.get(nftDataUrl);
                // Update state or perform actions with nftData

                if (nftData && nftData.data && nftData.status === 200) {
                    const owner = await callContractService.getOwnerOfToken(providerRef.current, nftId)
                    setNftData({...nftData.data, owner: owner.toString()})
                }

            } catch (error) {
                console.error("Error fetching NFT data:", error);
            }
        };

        fetchNFTData();
    }, [])

    return (
        <Card style={{ width: '18rem' }} className='mt-4 nft-card shadow-5 my-token hover-lift-glow'>
        <Card.Img variant="top" className='nft-image' width={278} height={278} src={nftData?.image} />
        <Card.Body>
            <Card.Title>{nftData?.name}</Card.Title>
            <Card.Text>
            {                
                nftData?.description || "No description available"
            }
            </Card.Text>
            <div className='d-flex justify-content-between'>
                <div>
                    <PrimaryButton className={'nft-button'}  
                        text={'chi tiết'}
                        icon={<IoSearchCircle size={20} />}
                        onClickFunc={() => handleClickDetailNFT({
                            contractAddress: contractAddress,
                            ownerAddress: nftData?.owner,
                            tokenId: nftId,
                            imageUrl: nftData?.image
                        })}
                    />
                </div>
                <div>
                    <a href={`https://sepolia.etherscan.io/address/${nftData?.owner}`}>
                        <Tag children={
                            <>
                                <img src={logo} width={20} />
                                &nbsp;
                                {
                                    nftData?.owner && account === nftData.owner
                                        ? "Bạn"
                                        : `${nftData?.owner?.slice(0, 6)}...${nftData?.owner?.slice(-4)}`
                                }
                            </>
                            } 
                            className={'nft-owner badge bg-danger'}
                        />
                    </a>
                </div>
            </div>
        </Card.Body>
        </Card>
    );
}

export default React.memo(NFTCard);