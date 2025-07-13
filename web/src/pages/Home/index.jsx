import { Container, Row, Col } from "react-bootstrap";
import './style.scss'
import PrimaryButton from "~/components/common/button/btn-primary";
import { FaEthereum } from "react-icons/fa6";
import logo from '~/assets/logo.jpeg';
import { FaGamepad } from "react-icons/fa";
import { MdOutlineDeveloperBoard } from "react-icons/md";
import { FaUserSecret } from "react-icons/fa6";

const HomePage = () => {
    return (
    <Container className="home-page">
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <div className="title mb-4 mt-4 align-items-center d-flex flex-column gap-2">
                <h1 className="text-center fw-bold text-light">
                    <FaGamepad/>&nbsp;Khám phá bộ sưu tập NFT giới hạn và bắt đầu hành trình sưu tầm ngay hôm nay.
                </h1>
                <img src={logo}
                 height="50"
                 alt="MDB Logo"
                 className="mx-auto"
                 loading="lazy" />
                <h5 className="text-muted text-center mb-4">
                    <MdOutlineDeveloperBoard />Smart Contract development, Blockchain, Solidity, ReactJS, Web3 
                    <br/> Developed by <a href="/"><FaUserSecret/>@phamtienanh</a>
                </h5>
            </div>

            <Row>
                <Col>
                    <PrimaryButton
                        text={'Kết nối với ví MetaMask'}
                        icon={<FaEthereum />}
                        className={'btn-connect-wallet'}
                    />
                </Col>
                <Col>
                    <PrimaryButton
                            text={'Kết nối với ví MetaMask'}
                            icon={<FaEthereum />}
                            className={'btn-danger btn-more'}
                        />
                </Col>
            </Row>
        </div>
    </Container>
    )
}


export default HomePage;