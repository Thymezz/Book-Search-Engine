import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<SearchBooks />} />
        <Route path="/saved" element={<SavedBooks />} />
        <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
      </Route>
    </Routes>
  </Router>
);
