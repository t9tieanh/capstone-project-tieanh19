import './style.scss'
import Button from 'react-bootstrap/Button';

const PrimaryButton = ({className, onClickFunc, type, text, icon, children}) => {
    return (
        <>
            <Button className={className} type= {type} variant="primary" onClick = {onClickFunc}> {icon} {text}
                {children}
            </Button>       
        </>
    )
}

export default PrimaryButton