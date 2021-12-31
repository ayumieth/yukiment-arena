import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Particles from "react-tsparticles";
import globalParticles from './consts/global-particles.const';

import Header from './components/header/Header';
import Arena from './pages/arena/Arena';
import Selection from './pages/selection/Selection';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <div className='head'>
          <Header />
        </div>

        <div className='content'>
          <Routes>
            <Route path="/" element={<Selection />} />
            <Route path="battle" element={<Arena />} />
          </Routes>
        </div>

        <Particles
          id="global-particles"
          options={globalParticles}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
