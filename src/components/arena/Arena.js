import Card from './../card/Card';
import './Arena.css';

export default function Arena() {
  return (
    <main className="Arena">
      <Card />

      <div className="Arena__Board">
        <div className="Arena__Board__Title">Quick Battle</div>

        <div className="Arena__Board__Content">
          <span className="Arena__Board__Label">Your Bet :</span>

          <div className="Arena__Board__Input">
            <input type="number" value="10" />
            <span>$MONSTA</span>
          </div>
        </div>

        <div className="Arena__Board__Button">Fight</div>
      </div>

      <Card />
    </main>
  );
}
