
import { AuthProvider } from './controls/authContext';
import Authentication from './pages/authentication';
import VideoMeet from './pages/videoMeet';
import LandingPage from './pages/landing';
import History from './pages/history';
import HomeComponent from './pages/home';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import ProtectedRoute from './controls/protectRoute';
function App() {
  

  return (
    <>
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage/> }/>
        
          <Route path='history' element={ <ProtectedRoute>  <History/>  </ProtectedRoute>}/>
        
        <Route path='/auth' element={<Authentication/>} />

        

          <Route path='/:url' element={<ProtectedRoute> <VideoMeet/> </ProtectedRoute>}/>
        

        <Route path='/home' element={<ProtectedRoute> <HomeComponent/></ProtectedRoute>}/>
      

      </Routes>
      </AuthProvider>
    </Router>
    </>
    
      
  );
}

export default App
