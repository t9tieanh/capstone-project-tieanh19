import './style.scss'
import Button from 'react-bootstrap/Button';

const CustomButton = ({className, onClickFunc, type, text, icon, children, variant}) => {
    return (
        <>
            <Button className={className} type= {type} variant={variant}  onClick = {onClickFunc}> {icon} {text}
                {children}
            </Button>       
        </>
    )
}

export default CustomButton