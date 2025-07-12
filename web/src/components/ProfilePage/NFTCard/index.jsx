import './style.scss';
import Card from 'react-bootstrap/Card';
import Button  from '~/components/common/button/btn-primary';
import { MdGeneratingTokens } from "react-icons/md";

const NFTCard = ({ nft }) => {
    return (
        <Card style={{ width: '18rem' }} className='mt-4 nft-card shadow-5'>
        <Card.Img variant="top" className='nft-image' src="https://img.freepik.com/free-photo/cyberpunk-bitcoin-illustration_23-2151611161.jpg" />
        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
            </Card.Text>
            <Button className={'nft-button'} icon={<MdGeneratingTokens/>} variant="primary">100$</Button>
        </Card.Body>
        </Card>
    );
}

export default NFTCard;