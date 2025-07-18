import Card from "~/components/common/Card";
import { FaChartArea } from "react-icons/fa";
import './style.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import NFTCard from "../NFTCard";
import callContractService from "~/service/callContract.service";
import { useContext } from "react";
import authenticationContext from "~/context/authentication.context";
import Canvas from '~/components/common/OffCanvas';
import NFTInfo from '../NFTInfo';
import { useCallback } from "react";


const NFTList = () => {

    const { providerRef } = useContext(authenticationContext);
    const [ tokenCount, setTokenCount ] = useState()
    const [ showDetail, setShowDetail ] = useState(false)

    const [nftInfo, setNftInfo] = useState({
        contractAddress: '',
        ownerAddress: '',
        tokenId: 0,
        imageUrl: ''
    });


    // lấy số lương token đã đào 
    useEffect(
        () => {
            const fetchTokenCount = async () => {
                try {
                    const tokenCountBigInt = await callContractService.getTokenCount(providerRef.current);
                        if (tokenCountBigInt !== undefined) {
                            setTokenCount(Number(tokenCountBigInt)); 
                        }
                } catch (e) {
                    console.log(e)
                }
            }
            fetchTokenCount()
        }, []
    )

    const handleClickDetailNFT = useCallback((nft) => {
        setShowDetail(true)
        // set lại state
        setNftInfo(nft)
    }, [])


    return <>
    <Card name={'Danh sách NFT'} 
        subTitle={'Bạn có thể nhìn thấy toàn bộ token ở đây.'}
        className={'nft-list'}
        icon={<FaChartArea/>}
        children={
            <>
            <Container>
            <Row>
                {Array.from({ length: tokenCount }, (_, index) => {
                    const nftId = index + 1;
                    return (
                        <Col key={nftId} md={3}>
                            <NFTCard 
                                nftId={nftId} 
                                handleClickDetailNFT={handleClickDetailNFT} 
                            />
                        </Col>
                    );
                })}
            </Row>
            </Container>
            </>
        }
    />

    <Canvas
        placement={'bottom'}
        header={<>Thông tin chi tiết về token này</>}
        show={showDetail}
        setShow={setShowDetail}
        className={'detail-nft'}
        style={{ height: '38vh' }}
        children={
            <>
                <NFTInfo
                    contractAddress={nftInfo.contractAddress}
                    ownerAddress={nftInfo.ownerAddress}
                    tokenId={nftInfo.tokenId}
                    imageUrl={nftInfo.imageUrl}
                />
            </>
        }
    />
    </>
}

export default NFTList;