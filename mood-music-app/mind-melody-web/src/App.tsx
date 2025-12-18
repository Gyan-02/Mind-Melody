import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blend from './pages/Blend';
import BlendDetail from './pages/BlendDetail';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import LikedSongs from './pages/LikedSongs';
import RecentlyPlayed from './pages/RecentlyPlayed';
import Receiver from './pages/Receiver';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './context/ToastContext';

function App() {
    return (
        <PlayerProvider>
            <ToastProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/blend" element={<Blend />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/playlist/:id" element={<PlaylistDetail />} />
                            <Route path="/blend/:id" element={<BlendDetail />} /> {/* Added route for BlendDetail */}
                            <Route path="/liked" element={<LikedSongs />} />
                            <Route path="/recently-played" element={<RecentlyPlayed />} />
                            <Route path="/receiver" element={<Receiver />} />
                        </Routes>
                    </Layout>
                </Router>
            </ToastProvider>
        </PlayerProvider>
    );
}

export default App;
