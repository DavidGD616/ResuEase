import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResumeBuilder from './pages/ResumeBuilder';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;