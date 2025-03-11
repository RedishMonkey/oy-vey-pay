
import {Route,Routes} from 'react-router'
import { AuthForm } from './components/AuthForm'
import {ToastContainer} from 'react-toastify'
import { Dashboard } from './components/Dashboard';
import { Navbar } from './components/Navbar';
import { useAuth } from './components/AuthProvider';
import {Expenses} from './components/Expenses';
import {Incomes} from './components/Income';
import { Loading } from './components/Loading';


function App() {
  const {isLoggedIn,user,isPending} = useAuth();
  if(isPending){
    return <Loading/>
  }
  return ( 
  <>
  {isLoggedIn ? <Navbar/> : null}
  <Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/auth" element={<AuthForm/>}/>
    <Route path="/expenses" element={<Expenses/>}/>
    <Route path="/incomes" element={<Incomes/>}/>
  </Routes>
    <ToastContainer position='top-right' theme='colored' autoClose={5000}/>
</>
  );
  
}

export default App
