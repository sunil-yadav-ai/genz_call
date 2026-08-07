
import Authentication from './pages/authentication';
import LandingPage from './pages/landing';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
function App() {
  

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/> }/>
        <Route path='/auth' element={<Authentication/>} />

      </Routes>
    </Router>
    </>
    
      
  );
}

export default App
