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

const Banner = () => {

  const { signerRef } = useContext(AuthenticationContext);
  const [showCanvas, setShowCanvas] = useState(false);

  const handleBuyMore = () => {
    setShowCanvas(true);
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


  return (
    <>
    <div className='banner'>
      <h1>Mua thêm token</h1>
      <p><IoIosWarning/>Giới hạn mỗi account được phép mua 10 token!.</p>
      <PrimaryButton className={'btn-buy bg-danger'} 
        icon={<FaEthereum />}
        onClickFunc={handleBuyMore}
      >Mua</PrimaryButton>
    </div>

    {/* show nút xác nhận mua token */}
    <OffCanvas show={showCanvas} setShow={setShowCanvas} 
      header={'Xác nhận mua token'} 
      children={<ConfirmBuyToken onConfirmBuyToken={buyToken}
        closeModal={() => setShowCanvas(false)}
      />}
      className={'confirm-buy-token'}
      style={{backgroundColor: '#313233ff', color: 'white'}}
    />
    </>
  );
}

export default Banner;