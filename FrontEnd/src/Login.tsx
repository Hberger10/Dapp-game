import { doLogin } from "./Web3Service";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const account = localStorage.getItem("account");
    if (account) {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      RedirectAfterLogin(isAdmin);
    }
  }, []);

  function RedirectAfterLogin(isadmin: boolean) {
    if (isadmin) {
      navigate("/admin");
    } else {
      navigate("/app");
    }
  }

  function onBtnClick() {
    setMessage("Logging in ...");
    doLogin()
      .then(result => RedirectAfterLogin(result.isAdmin))
      .catch(err => setMessage(err.message));
  }

  return (
    <div className="min-vh-100 d-flex flex-column text-bg-dark">
      {/* Header */}
      <header className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0 text-light">Dapp JoKenPo</h3>
          <nav className="nav">
            <a className="nav-link fw-bold text-light active" aria-current="page" href="#">Home</a>
            <a className="nav-link fw-bold text-light" href="#">About</a>
          </nav>
        </div>
      </header>

      {/* Main Content - Centralizado */}
      <main className="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-3 text-center">
        <h1 className="display-4 fw-bold text-light mb-3">Log in and play with us</h1>
        <p className="lead text-light mb-4">
          Play Rock and Paper and Scissors with your friends and earn prizes
        </p>
        <p className="lead mb-3">
          <a 
            href="#" 
            onClick={onBtnClick} 
            className="btn btn-lg btn-light fw-bold border-white bg-white d-inline-flex align-items-center gap-2 px-4 py-3"
          >
            <img src="/assets/metamask.svg" alt="Metamask logo" width={48} />
            Log in with Metamask
          </a>
        </p>
        {message && <p className="lead text-light">{message}</p>}
      </main>

      
      <footer className="mt-auto text-white-50 text-center p-3">
        <p className="mb-0">Built by <a href="#" className="text-white text-decoration-none">Henrique Berger</a></p>
      </footer>
    </div>
  );
}

export default Login;