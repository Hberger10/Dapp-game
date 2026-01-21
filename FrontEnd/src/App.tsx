import Header from './Header';

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
        <h1 className="text-light">App Page</h1>
      </main>
    </div>
  );
}

export default App;