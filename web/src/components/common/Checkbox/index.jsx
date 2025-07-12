import Form from 'react-bootstrap/Form';

const CheckBox = ({name, value, id}) => {
    return (
        <>
            <Form.Check // prettier-ignore
                type={'checkbox'}
                id={id || `default-checkbox`}
                label={name}
                value={value}
            />
        </>
    )
}

export default CheckBox