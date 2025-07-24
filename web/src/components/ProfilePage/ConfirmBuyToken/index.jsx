import './style.scss';
import Form from 'react-bootstrap/Form';
import TextInput from '~/components/common/Input/Input2';
import { Row, Col } from 'react-bootstrap';
import PrimaryButton from '~/components/common/button/btn-primary';
import { IoPaperPlaneSharp } from 'react-icons/io5';
import { useState } from 'react';
import React, { memo } from 'react';
import { toast } from 'react-toastify';
import { maxPerWallet } from '~/config/contract';
import { pricePerToken } from '~/config/contract';
import { IoWarningSharp } from "react-icons/io5";

const ConfirmBuyToken = ({ onConfirmBuyToken, closeModal }) => {

    const [tokenNumber, setTokenNumber] = useState(1);

    const handleConfirm = async (e) => {

        e.preventDefault();

        if (tokenNumber <= 0) {
            toast.error('Số lượng token phải lớn hơn 0!');
            return;
        }

        if (tokenNumber > maxPerWallet) {
            toast.error(`Bạn chỉ có thể mua tối đa ${maxPerWallet} token!`);
            return;
        }

        // Call the onConfirm function passed from the parent component
        await onConfirmBuyToken(tokenNumber)
    }
    
    
    return <>
        <Form className='confirm-buy-token-form' onSubmit={(e) => handleConfirm(e)}>
            <h5 className="mb-3 text-left fw-bold">
                <IoWarningSharp />Lưu ý: Bạn chỉ có thể mua tối đa {maxPerWallet} token!
            </h5>
            <p className="text-left mb-4">
                Mỗi token có giá <strong>{pricePerToken} ETH</strong>
            </p>
            <Row>
                <Col>
                    <TextInput
                        name='Số lượng token muốn mua'
                        type='number'
                        placeholder='Nhập số lượng token'
                        value={tokenNumber}
                        setTokenNumber={setTokenNumber}
                        setValue={setTokenNumber}
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

export default memo(ConfirmBuyToken);