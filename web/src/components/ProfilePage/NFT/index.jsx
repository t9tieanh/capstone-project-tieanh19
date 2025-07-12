import Card from "~/components/common/Card";
import { FaChartArea } from "react-icons/fa";
import './style.scss';
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from "react";
import NFTCard from "../NFTCard";

const NFTList = () => {

    const [items, setItems] = useState([
        { id: 1, title: 'Item 1', content: 'Nội dung cho item 1' },
        { id: 2, title: 'Item 2', content: 'Nội dung cho item 2' },
        { id: 3, title: 'Item 3', content: 'Nội dung cho item 3' },
        { id: 4, title: 'Item 4', content: 'Nội dung cho item 4' },
        { id: 5, title: 'Item 4', content: 'Nội dung cho item 4' }
    ]);

    return <>

    <Card name={'Your NFT'} 
        subTitle={'Here you can see your NFTs.'}
        className={'nft-list'}
        icon={<FaChartArea/>}
        children={
            <>

            <Container>
            <Row>
                {items.map((item) => (
                <Col key={item.id} md={3}>
                    <NFTCard />
                </Col>
                ))}
            </Row>
            </Container>
            
            
            </>
        }
    />
    
    
    </>
}

export default NFTList;