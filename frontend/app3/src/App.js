import {Routes,Route} from 'react-router-dom';
import Home from './components/Home';
import AddEmp from './components/AddEmp';
import SearchEmp from './components/SearchEmp';
import UpdateEmp from './components/UpdateEmp';
import DeleteEmp from './components/DeleteEmp';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEmp />} />
        <Route path="/search" element={ <SearchEmp />} />
        <Route path="/update" element={ <UpdateEmp />} />
        <Route path="/delete" element={ <DeleteEmp />} />
      </Routes>
    </div>
  );
}

export default App;
