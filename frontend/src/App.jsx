
import { AuthProvider } from './controls/authContext';
import Authentication from './pages/authentication';
import LandingPage from './pages/landing';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
function App() {
  

  return (
    <>
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage/> }/>
        <Route path='/auth' element={<Authentication/>} />
      

      </Routes>
      </AuthProvider>
    </Router>
    </>
    
      
  );
}

export default App
