import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './style.scss';
import { FaCoins } from "react-icons/fa";
import logo from '~/assets/logo.jpeg'

const Header = () => {

  const navigate = useNavigate();

  return (
    <>
    <Nav
      activeKey="/home"
      onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
      className='px-4 header mb-4'
    >
      <div class="d-flex justify-content-between w-100 align-items-center">
        <div>
          <Container className='p-2'>
            <a class="navbar-brand" href="#">
            <img src={logo}
                 height="30"
                 alt="MDB Logo"
                 loading="lazy" />
            </a>
          </Container>
        </div>
        <div className='d-flex p-0 gap-2 align-items-center shadow-6 user-profile'>
          <div>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                alt="Generic placeholder image" className="img-fluid avartar" width={40} />
          </div>
          <div>
            <h6 class="mb-1">Danny McLoan</h6>
          </div>
        </div>
      </div>
      <hr/>
    </Nav>
    </>
  );
};

export default Header;
