import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home.js';
import Login from './Login.js';
import Register from './Register.js';
import Lk from './Lk.js';

function App() {

  function setTokens(aToken, rToken) {
    localStorage.setItem("refreshToken", rToken);
    localStorage.setItem("accessToken", aToken);
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/login' element={ <Login setTokens={setTokens} /> } />
        <Route path='/register' element={ <Register /> } />
        <Route path='/lk' element={ <Lk accessToken={localStorage.getItem('accessToken')} /> } /> 
      </Routes>
    </Router>
  );
}

export default App;
