import './style.scss';
import Form from 'react-bootstrap/Form';
import TextInput from '~/components/common/Input/Input2';
import { Row, Col } from 'react-bootstrap';
import PrimaryButton from '~/components/common/button/btn-primary';
import { IoPaperPlaneSharp } from 'react-icons/io5';
import { useState } from 'react';
import React, { memo } from 'react';
import { isAddress } from "ethers";
import { toast } from 'react-toastify';
import callContractService from '~/service/callContract.service';
import { useContext } from 'react';
import authenticationContext from '~/context/authentication.context';
import { NFT_ERRORS } from '~/config/contract';

const ConfirmAddToWhiteList = ({closeModal}) => {

    const [newAddress, setNewAddress] = useState('')
    const { signerRef } = useContext(authenticationContext);

    const handleConfirm = async (e) => {
        e.preventDefault();

        if (!isAddress(newAddress)) {
            toast.error('Định dạng address không hợp lệ !')
            return
        }

        try {
            const data = await callContractService.addUserToWhitelist(signerRef.current, newAddress)
            console.log('Transaction successful:', data);
            closeModal()
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
                        break;
                    case 'rejected':
                        toast.error("Bạn đã từ chối giao dịch.");
                        break;
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

    }

    return <>
        <Form className='confirm-buy-token-form' onSubmit={(e) => handleConfirm(e)}>
            <h5 className="mb-3 text-left fw-bold">
                Để tránh spam, bạn sẽ phải giới hạn quyền mint token của cộng đông !
            </h5>
            <Row>
                <Col>
                    <TextInput
                        name='Địa chỉ của ví'
                        type='text'
                        placeholder='Nhập địa chỉ của ví'
                        value={newAddress}
                        //setTokenNumber={setTokenNumber}
                        setValue={setNewAddress}
                    />
                </Col>
            </Row>
            <PrimaryButton 
                text={'Xác nhận'} 
                icon={<IoPaperPlaneSharp />} 
                className={'mt-3 bg-danger btn-confirm'}
            />
        </Form>
    </>
}

export default ConfirmAddToWhiteList