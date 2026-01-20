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

    // Header.tsx
return (
    // Mudei para 'justify-content-between' e adicionei 'py-3' para dar um ar
    <header className="d-flex flex-wrap justify-content-between py-3 mb-4 border-bottom">
        
        <a href="/app" className="d-flex align-items-center mb-3 mb-md-0 link-body-emphasis text-decoration-none">
             {/* Use text-light se o fundo for escuro, ou tire para padrão */}
            <span className="fs-4 text-light">Dapp JoKenPo</span>
        </a>

        <div className="col-md-3 text-end">
            <button type="button" className="btn btn-outline-danger me-2" onClick={onLogoutClick}>Logout</button>
        </div>
    </header>
)
}

export default Header;