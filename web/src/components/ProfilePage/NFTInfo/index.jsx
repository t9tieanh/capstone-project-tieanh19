import React from 'react';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import './style.scss'
import PrimaryButton from '~/components/common/button/btn-primary';
import { FaCopy } from "react-icons/fa";
import { toast } from 'react-toastify';

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => toast.success('Đã sao chép: ' + text))
    .catch((err) => console.error('Lỗi sao chép:', err));
};

const InfoRow = ({ label, value }) => (
  <div className="mb-2 d-flex align-items-center">
    <strong className="me-2">{label}:</strong>
    <span className="text-truncate">{value}</span>
    <PrimaryButton 
        icon={<FaCopy/>}
        onClickFunc={() => copyToClipboard(value)}
        className={'ml-3 bg-dark btn-copy'}
    />
  </div>
);

const NFTInfo = ({ contractAddress, ownerAddress, tokenId, imageUrl }) => {
  return (
    <Container>
      <Card className="shadow-sm nft-info">
        <Row className="g-0">
          <Col md={2}>
            <Card.Img variant="top" src={imageUrl} alt={`NFT #${tokenId}`} />
          </Col>
          <Col md={10}>
            <Card.Body>
              <Card.Title>Thông tin NFT</Card.Title>
              <InfoRow label="Contract" value={contractAddress} />
              <InfoRow label="Owner" value={ownerAddress} />
              <InfoRow label="Token ID" value={tokenId} />
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default NFTInfo;
