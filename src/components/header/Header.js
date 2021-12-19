import './Header.css';

export default function Header() {
  return (
    <nav className="Header">
      <div className="Header__Wrapper">
        <div className="Header__Items Header__Items--left">
          <div className="Header__Item">
            <img className="Header__Item__Icon" src="./imgs/shop.png" alt="Shop Icon" />
            <span className="Header__Item__Label">Shop</span>
          </div>

          <div className="Header__Item">
            <img className="Header__Item__Icon" src="./imgs/trade.png" alt="Trade Icon" />
            <span className="Header__Item__Label">Trade</span>
          </div>
        </div>

        <div className="Header__Items Header__Items--center">
          <img className="Header__Item__Logo" src="./logo.png" alt="App Logo" />
        </div>

        <div className="Header__Items Header__Items--right">
          <div className="Header__Item">
            <img className="Header__Item__Icon" src="./imgs/battle.png" alt="Battle Icon" />
            <span className="Header__Item__Label">Battle</span>
          </div>

          <div className="Header__Item">
            <img className="Header__Item__Icon" src="./imgs/rewards.png" alt="Rewards Icon" />
            <span className="Header__Item__Label">Rewards</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
