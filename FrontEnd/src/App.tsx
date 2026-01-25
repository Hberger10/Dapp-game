import Header from './Header';
import { useState,useEffect, } from 'react';
import { type LeaderBoard , Choice,getResult,play,getLeaderBoard} from './Web3Service';


import '../public/assets/jokenpo.css'; 

function App() {
  const [message, setMessage] = useState("Choose your move to play!");
  const [LeaderBoard, setLeaderBoard] = useState<LeaderBoard>();

  useEffect(() => {
  getLeaderBoard()
    .then(leaderboard => setLeaderBoard(leaderboard))
    .catch(err => setMessage(err.message))
}, [])

  function onPlay(option: Choice) {
  setLeaderBoard({ ...LeaderBoard, result: "Sending your choice..." })
  play(option)
    .then(tx => getResult())
    .then(result => setLeaderBoard({ ...LeaderBoard, result }))
    .catch(err => setMessage(err.message))
}


  return (  
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Header />
      
      <main className="container flex-grow-1 d-flex flex-column justify-content-center py-4">
        
        
        <div className="text-center mb-5 text-dark">
            <h1 className="display-4 fw-bold text-uppercase">Jo-Ken-Po</h1>
            <p className="lead text-muted">Make your bid in Blockchain</p>
        </div>

        <div className="card card-body border-0 shadow">
  <h5 className="mb-3 text-primary">Current Status:</h5>

  <div className="alert alert-success">
    {
      LeaderBoard && LeaderBoard.result
        ? LeaderBoard.result
        : "Loading..."
    }
  </div>

  <h5 className="mb-3 text-primary">
    {
      LeaderBoard && LeaderBoard.result?.indexOf("won") !== -1 || !LeaderBoard?.result
        ? "Start a new game:"
        : "Play this game:"
    }
  </h5>
</div>


        
        <div className="row justify-content-center g-4">
            
            
            <div className="col-12 col-md-4">
                <div className="card h-100 shadow-sm border-0 align-items-center p-4 play-button" onClick={() => onPlay(Choice.ROCK)}>
                    <img 
                        src="/assets/rock.png" 
                        alt="Pedra" 
                        className="img-fluid mb-3" 
                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                    />
                    <h3 className="h5 mb-3">Rock</h3>
                    {/* Botão preparado para sua lógica */}
                    <button className="btn btn-warning w-100 mt-auto">
                        Play 
                    </button>
                </div>
            </div>

            {/* Opção: PAPEL */}
            <div className="col-12 col-md-4">
                <div className="card h-100 shadow-sm border-0 align-items-center p-4 play-button" onClick={() => onPlay(Choice.PAPER)}>
                    <img 
                        src="/assets/paper.png" 
                        alt="Papel" 
                        className="img-fluid mb-3"
                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                    />
                    <h3 className="h5 mb-3">Paper</h3>
                    <button className="btn btn-info w-100 mt-auto">
                        Play 
                    </button>
                </div>
            </div>

            {/* Opção: TESOURA */}
            <div className="col-12 col-md-4">
                <div className="card h-100 shadow-sm border-0 align-items-center p-4 play-button" onClick={() => onPlay(Choice.SCISSORS)}>
                    <img 
                        src="/assets/scissors.png" 
                        alt="Tesoura" 
                        className="img-fluid mb-3"
                        style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                    />
                    <h3 className="h5 mb-3">Scissors</h3>
                    <button className="btn btn-danger w-100 mt-auto">
                        Play
                    </button>
                </div>
            </div>

        </div>

        
        <div className="text-center mt-5">
             <div className="alert alert-info d-inline-block px-5">
                <span className="fw-bold">{message}</span>
             </div>
        </div>

      </main>
    </div>
  );
}


export default App;