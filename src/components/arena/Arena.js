import { CardEntity } from '../../entities/CardEntity';
import Card from './../card/Card';
import classes from './Arena.module.css';

export default function Arena() {
  const card1 = new CardEntity({ name: 'Yetimon', winner: true, points: 68, lvl: 20 });
  const card2 = new CardEntity({ name: 'Dragomon', winner: false, points: 154, lvl: 20 });

  return (
    <main className={classes.arena}>
      <Card card={card1} />

      <div className={classes.board}>
        <div className={classes.title}>Quick Battle</div>

        <div className={classes.content}>
          <span className={classes.label}>Your Bet :</span>

          <div className={classes.input}>
            <input type="number" placeholder='10' />
            <span>$MONSTA</span>
          </div>
        </div>

        <div className={classes.button}>Fight</div>
      </div>

      <Card card={card2} />
    </main>
  );
}
