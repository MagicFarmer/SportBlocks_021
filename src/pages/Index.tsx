
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from './Home';
import Gallery from './Gallery';
import Mint from './Mint';
import Marketplace from './Marketplace';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Index;
