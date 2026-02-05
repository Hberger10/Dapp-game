import Header from './Header';
import { useState, useEffect } from 'react';
import { type LeaderBoard, Choice, play, finishGame, getResult,doListen } from './Web3Service';
import '../public/assets/jokenpo.css'; 

function JoKenPo() {
  const [message, setMessage] = useState("Choose your move to play!");
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>();

  
  async function refreshStatus() {
    try {
        const currentStatus = await getResult(); 
        setMessage(currentStatus || "Start a new game");
        setLeaderBoard(prev => ({...prev, result: currentStatus} as LeaderBoard));
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
    }
  }

  
  useEffect(() => {
  refreshStatus();

  let subscription: any;

  const startMonitoring = async () => {
    subscription = await doListen(() => {
      console.log("Evento recebido! Aguardando atualização...");
      
     
      setTimeout(() => {
        refreshStatus();
      }, 2000); 
    });
  };

  startMonitoring();

  return () => {
    if (subscription && subscription.unsubscribe) {
      subscription.unsubscribe();
    }
  };
}, []);

  
  async function onPlay(option: Choice) {
    setLeaderBoard({ ...leaderBoard, result: "Sending your choice..." });
    setMessage("Sending transaction...");
    
    try {
       await play(option);
       
       await refreshStatus(); 
    } catch (err: any) {
       setMessage(err.message || "Error");
    }
  }

  
  async function onResult() {
    setMessage("Resolving game (calculating winner)...");
    try {
        
        await finishGame();
        setMessage("Game finished! Checking winner...");
        await refreshStatus(); 
    } catch (error: any) {
        setMessage("Error resolving: " + (error.message || error));
    }
  }

  return (  
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Header />
      
      <main className="container flex-grow-1 d-flex flex-column justify-content-start py-4 pb-5">

        
        <div className="text-center mb-5 text-dark">
            <h1 className="display-4 fw-bold text-uppercase">Jo-Ken-Po</h1>
            <p className="lead text-muted">Make your bid in Blockchain</p>
        </div>

        {/* --- CARD DE STATUS --- */}
        <div className="card card-body border-0 shadow mb-5 text-center">
          <h5 className="mb-3 text-primary">Current Status:</h5>

          <div className="alert alert-success d-inline-block px-4">
            {message}
          </div>

          <h5 className="mb-3 text-primary">
            {
              leaderBoard && leaderBoard.result?.indexOf("win") !== -1
                ? "Play again:"
                : "Choose your move:"
            }
          </h5>

          {/* 👇 AQUI ESTÁ O QUE FALTAVA: O BOTÃO DE FINALIZAR 👇 */}
          {message && message.includes("Both players have played") && (
                <div className="mt-3">
                    <button 
                        className="btn btn-lg btn-success pulse-animation fw-bold" 
                        onClick={onResult}
                    >
                        🏆 Click here to Reveal Winner! 🏆
                    </button>
                </div>
          )}
          {/* -------------------------------------------------- */}
        </div>


        <div className="row justify-content-start g-4">
    
    {/* ROCK */}
    <div className="col-12 col-md-4">
        <div 
            className="card h-100 shadow-sm border-0 d-flex flex-column align-items-center p-4 pb-4 play-button" 
            style={{ cursor: 'pointer', overflow: 'visible' }} 
            onClick={() => onPlay(Choice.ROCK)}
        >
            <img 
                src="/assets/rock.png" 
                alt="Pedra" 
                className="img-fluid mb-3" 
                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            />
            <h3 className="h5 mb-3">Rock</h3>
            <button className="btn btn-warning w-100">Play</button>
        </div>
    </div>

            {/* PAPER */}
            <div className="col-12 col-md-4">
        <div 
            className="card h-100 shadow-sm border-0 d-flex flex-column align-items-center p-4 pb-4 play-button" 
            style={{ cursor: 'pointer', overflow: 'visible' }} 
            onClick={() => onPlay(Choice.PAPER)}
        >
            <img 
                src="/assets/paper.png" 
                alt="Papel" 
                className="img-fluid mb-3"
                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            />
            <h3 className="h5 mb-3">Paper</h3>
            <button className="btn btn-info w-100">Play</button>
        </div>
    </div>

            {/* SCISSORS */}
            <div className="col-12 col-md-4">
        <div 
            className="card h-100 shadow-sm border-0 d-flex flex-column align-items-center p-4 pb-4 play-button" 
            style={{ cursor: 'pointer', overflow: 'visible' }} 
            onClick={() => onPlay(Choice.SCISSORS)}
        >
            <img 
                src="/assets/scissors.png" 
                alt="Tesoura" 
                className="img-fluid mb-3"
                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
            />
            <h3 className="h5 mb-3">Scissors</h3>
            <button className="btn btn-danger w-100">Play</button>
        </div>
    </div>

</div>
        
        
        <div className="text-center mt-5">
             <div className="alert alert-light d-inline-block px-5 border">
                <small className="text-muted">Status: {message}</small>
             </div>
        </div>

      </main>
    </div>
  );
}

export default JoKenPo;