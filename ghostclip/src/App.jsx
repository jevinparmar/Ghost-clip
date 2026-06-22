import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReelsPage from './pages/ReelsPage';
import PostsPage from './pages/PostsPage';
// import removed: ProfilePicturePage no longer used

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
