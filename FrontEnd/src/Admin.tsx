import Header from './Header';

function Admin() {
  return (
    <>
      {/* 1. O Header fica FORA do container para ocupar 100% da largura */}
      <div className="container-fluid px-0"> {/* container-fluid = largura total */}
          <Header />
      </div>

      {/* 2. O conteúdo principal fica DENTRO do container para ficar centralizado e bonitinho */}
      <div className="container"> 
        <main>
            <h1 className="text-light">Admin Page</h1>
        </main>
      </div>
    </>
  )
}

export default Admin;