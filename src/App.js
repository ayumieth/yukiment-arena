import Header from './components/header/Header';
import Arena from './components/arena/Arena';

import Particles from "react-tsparticles";
import globalParticles from './consts/global-particles.const';

import './App.css';

function App() {
  return (
    <div className="App">
      <div className='App__Header'>
        <Header />
      </div>
      <div className='App__Content'>
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
