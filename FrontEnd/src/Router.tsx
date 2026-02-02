import type { JSX } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import Admin from './Admin.tsx';
import App from './App';
import Login from './Login';
import JoKenPo from './JoKenPo.tsx';

function Router() {

    type Props = {
        children: JSX.Element;
    }

    function PrivateRoute({ children }: Props) {
        const isAuth = localStorage.getItem("account") !== null;
        return isAuth ? children : <Navigate to="/" />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/admin' element={
                    <PrivateRoute>
                        <Admin />
                    </PrivateRoute>
                } />
                <Route path='/app' element={
                    <PrivateRoute>
                        <App />
                    </PrivateRoute>
                } />
                <Route path='/jokenpo' element={
                    <PrivateRoute>
                        <JoKenPo />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    )

}

export default Router;