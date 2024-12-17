import logo from './logo.svg';
import './App.css';
import FormQuestion from './components/FormQuestion';
import Navbar from './components/layout/Navbar';
import Tab from './components/layout/Tab';
import Home from './components/Home';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'
import FormAnswerRequest from './components/FormAnswerRequest';
import Login from './components/Login';
import FormResponse from './components/FormResponse';
import UserProfile from './components/UserProfile';
import ComposeEmail from './components/ComposeEmail';
import FormReview from './components/FormReview';
import MarksCompose from './components/MarksCompose';
import Drive from './components/Drive';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <>
    
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/new/:id' element={<FormQuestion/>}/>
        <Route path='/response/:id' element={<FormAnswerRequest/>}/>
        <Route path='/review/:id' element={<FormReview/>}/>
        <Route path='/answers/:id' element={<FormResponse/>}/>
        <Route path='/UserProfile' element={<UserProfile/>}/>
        <Route path='/emailCompose/:id' element={<ComposeEmail/>}/>
        <Route path='/marksCompose/:id' element={<MarksCompose/>}/>
        <Route path='/drive' element={<Drive/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
