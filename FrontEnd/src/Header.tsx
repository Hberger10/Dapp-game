import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doLogout, doLogin } from './Web3Service';

function Header() {

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("account") !== null) {
            if (localStorage.getItem("isAdmin") === "true") {
                doLogin()
                    .then(result => {
                        if (!result.isAdmin) {
                            localStorage.setItem("isAdmin", "false");
                            navigate("app");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        onLogoutClick()
                    });
            }
            else navigate("/app");
        }
        else
            navigate("/");
    }, [])

    function onLogoutClick() {
        doLogout();
        navigate("/");
    }

    
return (
    <header className="bg-dark border-bottom border-secondary">
      <div className="container-fluid px-4 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <a href="/app" className="text-decoration-none">
            <span className="fs-4 text-light">Dapp JoKenPo</span>
          </a>
          <button 
            type="button" 
            className="btn btn-outline-danger" 
            onClick={onLogoutClick}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header;