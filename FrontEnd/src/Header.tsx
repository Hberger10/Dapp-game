import { useNavigate } from 'react-router-dom';
import { doLogout } from './Web3Service';

function Header() {

    const navigate = useNavigate();

 
    function onLogoutClick() {
        doLogout();
        
        localStorage.removeItem("account");
        localStorage.removeItem("isAdmin");
        navigate("/"); 
    }

    return (
        <header className="bg-dark border-bottom border-secondary sticky-top">
            <div className="container-fluid px-4 py-3">
                <div className="d-flex justify-content-between align-items-center">
                    
                    
                    <div 
                        className="d-flex align-items-center text-decoration-none" 
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/app")}
                    >
                        <span className="fs-4 text-light fw-bold">🎲 Dapp Hub</span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        {/* 2. Mostra carteira resumida (Visual pro) */}
                        <span className="text-primary small d-none d-md-block">
                            {localStorage.getItem("account") 
                                ? `${localStorage.getItem("account")?.substring(0,6)}...${localStorage.getItem("account")?.substring(38)}` 
                                : ""}
                        </span>

                        
                        <button 
                            type="button" 
                            className="btn btn-outline-danger btn-sm" 
                            onClick={onLogoutClick}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;