import './style.scss';

const Footer = () => {
    return (
        <>
            <footer className="mainfooter" role="contentinfo" >
            <div className="footer-middle" style={{ paddingTop: "1em" }}>

                    <div className="container">
                        <div className="row">

                            <div className="col-4">
                                <h5 style= {{color:'rgb(49, 48, 48)'}}>Free class room</h5>
                            </div>
                            <div className="col-5"> <p>Made by <strong> Pham Tien Anh</strong> | Verson : <strong> 1.0.0</strong></p></div>
                            <div className="col-3">
                                <p> Source Code on Github  <a href="https://github.com/t9tieanh/freeclassroom_"><i className="fab fa-github"></i></a>  </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;