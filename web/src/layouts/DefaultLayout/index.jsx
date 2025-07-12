import './style.scss'
import { Outlet } from 'react-router-dom';
import Header from '~/components/common/Header/Header'
import Footer from '~/components/common/Footer/Footer';
import { Container } from 'react-bootstrap';

const DefaultLayout = () => {
    return <>
        <Header />
        <Container className='main-container'>
            <Outlet />
        </Container>
        <Footer />
    </>
}

export default DefaultLayout;