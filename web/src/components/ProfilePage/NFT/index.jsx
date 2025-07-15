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
        { id: 5, title: 'Item 5', content: 'Nội dung cho item 5' },
        { id: 6, title: 'Item 6', content: 'Nội dung cho item 6' },
        { id: 7, title: 'Item 7', content: 'Nội dung cho item 7' },
        { id: 8, title: 'Item 8', content: 'Nội dung cho item 8' },
        { id: 9, title: 'Item 9', content: 'Nội dung cho item 9' },
        { id: 10, title: 'Item 10', content: 'Nội dung cho item 10' }
    ]);


    return <>

    <Card name={'Danh sách NFT'} 
        subTitle={'Bạn có thể nhìn thấy toàn bộ token ở đây.'}
        className={'nft-list'}
        icon={<FaChartArea/>}
        children={
            <>

            <Container>
            <Row>
                {items.map((item, index) => (
                <Col key={index} md={3}>
                    <NFTCard nftId={item.id} />
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