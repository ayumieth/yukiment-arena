import { useEffect, useState } from 'react';
import { CardEntity } from '../../entities/CardEntity';
import CoinSelect from '../coin-select/CoinSelect';
import Card from './../card/Card';
import classes from './Arena.module.css';

export default function Arena() {
  const maxBet = 3045.98;
  const minBet = 0.00001;

  const card1 = new CardEntity({ name: 'Yetimon', winner: true, points: 68, lvl: 20 });
  const card2 = new CardEntity({ name: 'Dragomon', winner: false, points: 154, lvl: 20 });

  const [bet, setBet] = useState({ value: 0, coin: 'monsta' });

  const onBetValueChange = e => {
    setBet({ ...bet, value: e });
  }

  const onBetCoinChange = e => {
    setBet({ ...bet, coin: e });
  }

  const onFight = () => {
    alert('Fight!!!');
  }

  const onSkip = () => {
    alert('Skip!!!');
  }

  useEffect(() => {
    console.log({ bet });
  }, [bet]);

  return (
    <main className={classes.arena}>
      <Card card={card1} />

      <div className={classes.board}>
        <div className={classes.title}>
          <span>Quick Battle</span>
        </div>

        <div className={classes.content}>
          <span className={classes.label}>Your Bet :</span>
          <CoinSelect
            stepValue={0.1}
            maxValue={maxBet}
            minValue={minBet}
            onCoinChange={onBetCoinChange.bind(this)}
            onValueChange={onBetValueChange.bind(this)}
          />
        </div>

        <div className={classes.controls}>
          <div className={classes.button} onClick={onFight}>Fight</div>
          <a className={classes.link} onClick={onSkip}>Skip</a>
        </div>
      </div>

      <Card card={card2} />
    </main>
  );
}
