import { useState,useEffect } from 'react';
import Header from './Header';
import type { Dashboard } from './Web3Service';
import { getDashboard, upgrade, setBid, setCommission } from './Web3Service';




function Admin() {
    const [message, setMessage] = useState("");
    const [dashboard, setDashboard] = useState<Dashboard>();

    useEffect(() => {
        getDashboard()
            .then(dashboard => setDashboard(dashboard))
            .catch(err => setMessage(err.message));
    }, [])

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDashboard(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function onUpgradeClick() {
      if (!dashboard?.address)
            return setMessage("Address is required!");

      
      upgrade(dashboard?.address || "")
      .then(() => alert("upgraded"))
      .catch(err => setMessage(err.message)); 
    }

    function onChangeCommissionClick() {
      if (!dashboard?.commission)
            return setMessage("Commission is required!");
      setCommission(Number(dashboard?.commission || 0))
      .then(() => alert("commission changed"))
      .catch(err => setMessage(err.message)); 
    }

    function onChangeBidClick() {
      if (!dashboard?.bid)
            return setMessage("Bid is required!");
      setBid(dashboard?.bid || "")
      .then(() => alert("bid changed"))
      .catch(err => setMessage(err.message)); 
    }
    return (
        <div className="container">
            <Header />
            <main>
                <div className="py-5 text-center">
                    <img className="d-block mx-auto mb-4" src="/logo512.png" alt="JoKenPo" width="72" />
                    <h2>Administrative Panel</h2>
                    <p className="lead">Change the players' bid, your commission and upgrade the contract.</p>
                    <p className="lead text-danger">{message}</p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-10">
                        <div className="row g-3">
                            {/* CAMPO BID */}
                            <div className="col-sm-6">
                                <label htmlFor="bid" className="form-label">Bid (wei):</label>
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="bid" 
                                        value={dashboard?.bid || ""} 
                                        onChange={onInputChange} 
                                    />
                                    <button type='button' className='btn btn-primary d-inline-flex align-items-center' onClick={onChangeBidClick}>Change Bid</button>
                                    <span className="input-group-text bg-secondary text-white">wei</span>
                                </div>
                            </div>

                            {/* CAMPO COMMISSION */}
                            <div className="col-sm-6">
                                <label htmlFor="commission" className="form-label">Commission (%):</label>
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="commission" 
                                        value={dashboard?.commission || ""} 
                                        onChange={onInputChange} 
                                    />
                                    <button type='button' className='btn btn-primary d-inline-flex align-items-center' onClick={onChangeCommissionClick}>Change Commission</button>
                                    
                                    <span className="input-group-text bg-secondary text-white">%</span>
                                </div>
                            </div>

                            {/* CAMPO UPGRADE ADDRESS */}
                            <div className="col-12">
                                <label htmlFor="address" className="form-label">New Contract Address:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="address" 
                                    placeholder="0x..."
                                    value={dashboard?.address || ""} 
                                    onChange={onInputChange} 
                                />
                                <button type='button' className='btn btn-primary d-inline-flex align-items-center' onClick={onUpgradeClick}>Upgrade Contract</button>
                            </div>
                        </div>

                        <hr className="my-4" />

                        <button className="w-100 btn btn-primary btn-lg" type="button">
                            Save Configuration
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Admin;