import './style.scss';
import PrimaryButton from '~/components/common/button/btn-primary';
import { FaEthereum } from 'react-icons/fa6';
import callContractService from '~/service/callContract.service';
import { useContext } from 'react';
import AuthenticationContext from '~/context/authentication.context';
import { IoIosWarning } from 'react-icons/io';
import OffCanvas from '~/components/common/OffCanvas';
import { useState } from 'react';
import ConfirmBuyToken from '../ConfirmBuyToken';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { NFT_ERRORS } from '~/config/contract';
import { contractAddress } from '~/config/contract';
import ConfirmAddToWhiteList from '../ConfirmAddToWhiteList';
import { IoMdPersonAdd } from "react-icons/io";

const Banner = () => {

  const { signerRef, owner, account } = useContext(AuthenticationContext);
  const [showCanvasBuyToken, setShowCanvasBuyToken] = useState(false);

  // state add to whitelist
  const [showCanvasAddWhiteList, setShowCanvasAddWhiteList] = useState(false)
  

  // - xử lý buy thêm token 
  const handleBuyMore = () => {
    setShowCanvasBuyToken(true);
  };
  
  const buyToken = useCallback(async (tokenNumber) => {
    try {
        const tx = await callContractService.mintNFT(signerRef.current, tokenNumber);
        console.log('Transaction successful:', tx);
    } catch (error) {
        if (error.reason) {
          switch (error.reason) {
            case NFT_ERRORS.NOT_WHITELISTED:
              toast.error("Bạn chưa được vào White List!");
              break;
            case NFT_ERRORS.AMOUNT_MUST_BE_GREATER_THAN_ZERO:
              toast.error("Số lượng token muốn mua phải lớn hơn 0.");
              break;
            case NFT_ERRORS.MAX_SUPPLY_EXCEEDED:
              toast.error("Đã vượt quá tổng cung cho phép.");
              break;
            case NFT_ERRORS.MAX_PER_WALLET_EXCEEDED:
              toast.error("Đã vượt số lượng tối đa mỗi ví.");
              break;
            case NFT_ERRORS.NOT_ENOUGH_ETH:
              toast.error("Bạn không đủ ETH để thực hiện giao dịch.");
              break;
            case 'insufficient funds for gas * price + value: have 0 want 200000000000000':
              toast.error("Bạn không đủ ETH để thanh toán phí gas.");
            default:
              toast.error(`Lỗi không xác định: ${error.reason || error.message}`);
              break;
          }
        } 
        else if (error.code) {
          if (error.code === "INSUFFICIENT_FUNDS")  toast.error('Bạn không đủ ETH để thực hiện giao dịch.');
          else if (error.code === 'ACTION_REJECTED') toast.error("Bạn đã từ chối giao dịch.");
          else {
            toast.error(`Lỗi không xác định: ${error.code}`);
          }
        }
    }
  }, []);

  // xử lý add to whitelist 
  const handleAddToWhiteList = () => {
    setShowCanvasAddWhiteList(true);
  };


  return (
    <>
    <div className='banner'>
      <h1>Mua thêm token</h1>
      <p><IoIosWarning/>Giới hạn mỗi account được phép mua 3 token!.</p>
      <PrimaryButton className={'btn-buy bg-danger'} 
        icon={<FaEthereum />}
        onClickFunc={handleBuyMore}
      >Mua</PrimaryButton>

      <a href={`https://sepolia.etherscan.io/address/${contractAddress}`} className='mx-3'>
      <PrimaryButton className={'btn-buy bg-primary'} 
        icon={<FaEthereum />}
        text={'Chi tiết Smart Contract'}
      />
      </a>

      {/* chỉ owner mới dùng được add to whitelist */}
      {
        owner && account && owner === account &&
        <>
        <PrimaryButton
          text={<><IoMdPersonAdd />Thêm tài khoản vào White List</>}
          className={'btn-buy bg-light text-dark ml-3'}
          onClickFunc={handleAddToWhiteList}
        />
        <OffCanvas show={showCanvasAddWhiteList} setShow={setShowCanvasAddWhiteList} 
          header={'Xác nhận Thêm vào White List'} 
          children={
            <ConfirmAddToWhiteList 
              closeModal={() => {setShowCanvasAddWhiteList(false)}}
            />
          }
          className={'confirm-buy-token'}
          style={{backgroundColor: '#313233ff', color: 'white'}}
        />
        </>
      }
    </div>

    {/* show nút xác nhận mua token */}
    <OffCanvas show={showCanvasBuyToken} setShow={setShowCanvasBuyToken} 
      header={'Xác nhận mua token'} 
      children={<ConfirmBuyToken onConfirmBuyToken={buyToken}
        closeModal={() => setShowCanvasBuyToken(false)}
      />}
      className={'confirm-buy-token'}
      style={{backgroundColor: '#313233ff', color: 'white'}}
    />
    </>
  );
}

export default Banner;