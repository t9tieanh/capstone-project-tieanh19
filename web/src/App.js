import './App.css';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
