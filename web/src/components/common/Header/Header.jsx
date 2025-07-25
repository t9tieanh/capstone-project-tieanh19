import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './style.scss';
import { useContext } from 'react';
import logo from '~/assets/logo.jpeg'
import AuthenticationContext from '~/context/authentication.context';

const Header = () => {

  const { account, balance } = useContext(AuthenticationContext);

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
        {
          account ? (
            <>
              <div className='d-flex p-0 gap-2 align-items-center shadow-6 user-profile'>
                <div>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoaInh7Sh0Rq69jjCp2KzMl-Yg--kWFhmEkWFzP5GiJgcM_lhoAkqzBQSYXtYbM4TZVag&usqp=CAU"
                      alt="Generic placeholder image" className="img-fluid avartar" width={40} />
                </div>
                <div>
                  <h6 className="mb-1">
                    Wallet: {account
                      ? `${account.slice(0,6)}...${account.slice(-4)}`
                      : ""}
                  </h6>
                  <div className='balance'><h6>Số dư: {balance} $</h6></div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )
        }
      </div>
      <hr/>
    </Nav>
    </>
  );
};

export default Header;
