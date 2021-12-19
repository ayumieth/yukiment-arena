import { CardEntity } from '../../entities/CardEntity';
import Card from './../card/Card';
import './Arena.css';

export default function Arena() {
  const card1 = new CardEntity({ name: 'Yetimon', winner: true, points: 68, lvl: 20 });
  const card2 = new CardEntity({ name: 'Dragomon', winner: false, points: 154, lvl: 20 });

  return (
    <main className="Arena">
      <Card card={card1} />

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

      <Card card={card2} />
    </main>
  );
}
