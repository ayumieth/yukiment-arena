import Header from './components/header/Header';
import Arena from './components/arena/Arena';

import Particles from "react-tsparticles";
import globalParticles from './consts/global-particles.const';

import './App.css';

function App() {
  return (
    <div className="app">
      <div className='head'>
        <Header />
      </div>
      <div className='content'>
        <Arena />
      </div>

      <Particles
        id="global-particles"
        options={globalParticles}
      />
    </div>
  );
}

export default App;
