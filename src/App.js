import Header from './components/header/Header';
import Arena from './components/arena/Arena';

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
    </div>
  );
}

export default App;
