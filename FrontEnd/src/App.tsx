  import Header from './Header';
  import { useNavigate } from 'react-router-dom';
  import '../public/assets/app.css'; 

  function App() {
    const navigate = useNavigate();

    return (
      <div className="app-container">
        <Header />
        
        <div className="content">
          <div className="title-section">
            <h1>Choose Your Game</h1>
            <p>Select a game below and start playing</p>
          </div>

          <div className="games-row">
            <div className="game-card" onClick={() => navigate('/jokenpo')}>
              <img src="/assets/rock.png" alt="Rock Paper Scissors" />
              <h3>JoKenPo</h3>
              <p>The classic strategy game</p>
              <span className="play-link">Play Now →</span>
            </div>

            <div className="game-card " onClick={() => alert('Coming Soon!')}>
              <img src="/assets/porrinha.png" alt="Porrinha" />
              <h3>Porrinha</h3>
              <p>Guess the total fingers</p>
              <span className="play-link">Coming Soon</span>
            </div>
          </div>

          <div className="faucet-section">
            <h2>🎁 Free to Play!</h2>
            <p>Want to play for free? Get your faucet tokens here and start betting with no risk!</p>
            <button className="faucet-button" onClick={() => alert('Faucet coming soon!')}>
              Claim Faucet →
            </button>
          </div>

          <div className="footer">
            <p>Play responsibly • All games are provably fair</p>
          </div>
        </div>
      </div>
    );
  }

  export default App;