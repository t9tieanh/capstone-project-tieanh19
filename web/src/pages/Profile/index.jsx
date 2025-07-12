import { Container, Row, Col } from "react-bootstrap";
import './style.scss';
import Banner from '~/components/ProfilePage/Banner';
import WalletBalance from "~/components/ProfilePage/WalletBalance";
import NFTList from "~/components/ProfilePage/NFT";

const ProfilePage = () => {
  return (
    <>
        <Container className="profile-page">
            <Row>
                <Col xl={8}>
                    <Banner/>
                </Col>
                <Col>
                    <WalletBalance/>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                <NFTList/>
                </Col>
            </Row>
        </Container>
    </>
  );
}

export default ProfilePage;