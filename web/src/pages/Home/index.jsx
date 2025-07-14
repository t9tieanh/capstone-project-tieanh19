import { Container, Row, Col } from "react-bootstrap";
import './style.scss'
import PrimaryButton from "~/components/common/button/btn-primary";
import { FaEthereum } from "react-icons/fa6";
import logo from '~/assets/logo.jpeg';
import { FaGamepad } from "react-icons/fa";
import { MdOutlineDeveloperBoard } from "react-icons/md";
import { FaUserSecret } from "react-icons/fa6";
import { toast } from "react-toastify";
import AuthenticationContext from "~/context/authentication.context";
import { useContext, useState } from "react";
import ProfilePage from "../Profile";
import { BrowserProvider } from "ethers";
import { useRef } from "react";

const HomePage = () => {

    const { account, setAccount, providerRef, signerRef } = useContext(AuthenticationContext);


    const handleConnectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            toast.error("Bạn chưa cài đặt MetaMask. Vui lòng cài đặt MetaMask để kết nối ví.");
            return;
        }

        try {
                // Tạo provider từ MetaMask
                providerRef.current = new BrowserProvider(window.ethereum);
                await providerRef.current.send("eth_requestAccounts", []);
                signerRef.current = await providerRef.current.getSigner();

                const userAddress = await signerRef.current.getAddress();

                console.log("Địa chỉ ví:", userAddress);
                toast.success("Kết nối ví MetaMask thành công!");

                // Lấy network thông tin
                const network = await providerRef.current.getNetwork();
                console.log("Chain hiện tại:", network.chainId);

                if (network.chainId !== 11155111) { // 11155111 là Sepolia
                    try {
                        // Thử switch sang Sepolia
                        const accounts = await window.ethereum.request({
                            method: 'eth_requestAccounts'
                        });
                        setAccount(accounts[0]);
                        toast.success("Đã chuyển sang mạng Sepolia");
                    } catch (switchError) {
                        if (switchError.code === 4902) {
                            try {
                                // Thêm Sepolia nếu MetaMask chưa có
                                await window.ethereum.request({
                                    method: "wallet_addEthereumChain",
                                    params: [
                                        {
                                            chainId: "0xaa36a7",
                                            chainName: "Sepolia Test Network",
                                            nativeCurrency: {
                                                name: "SepoliaETH",
                                                symbol: "ETH",
                                                decimals: 18,
                                            },
                                            rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
                                            blockExplorerUrls: ["https://sepolia.etherscan.io"],
                                        },
                                    ],
                                });
                                toast.success("Đã thêm & chuyển sang Sepolia");
                            } catch (addError) {
                                console.error("Không thể thêm Sepolia:", addError);
                                toast.error("Không thể thêm mạng Sepolia");
                            }
                        } else {
                            console.error("Lỗi switch chain:", switchError);
                            toast.error("Hãy chuyển MetaMask sang Sepolia");
                        }
                    }
                } else {
                    setAccount(userAddress);
                    toast.success("Bạn đang ở đúng mạng Sepolia");
                }
            } catch (err) {
                console.error("Lỗi kết nối ví:", err);
                toast.error("Đã có lỗi khi kết nối ví");
            }
    };

    return account ? (
            <ProfilePage account = {account} provider = {providerRef.current} signer = {signerRef.current}  />
        ) : (
            <Container className="home-page">
                <div className="d-flex flex-column justify-content-center align-items-center h-100">
                    <div className="title mb-4 mt-4 align-items-center d-flex flex-column gap-2">
                        <h1 className="text-center fw-bold text-light">
                            <FaGamepad />&nbsp;Khám phá bộ sưu tập NFT giới hạn và bắt đầu hành trình sưu tầm ngay hôm nay.
                        </h1>
                        <img
                            src={logo}
                            height="50"
                            alt="MDB Logo"
                            className="mx-auto"
                            loading="lazy"
                        />
                        <h5 className="text-muted text-center mb-4">
                            <MdOutlineDeveloperBoard /> Smart Contract development, Blockchain, Solidity, ReactJS, Web3
                            <br /> Developed by <a href="/"><FaUserSecret />@phamtienanh</a>
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
                                onClickFunc={handleConnectWallet}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        );
}


export default HomePage;