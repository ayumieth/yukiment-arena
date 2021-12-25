import { useEffect, useState } from 'react';
import { CardEntity } from '../../entities/CardEntity';
import CoinSelect from '../coin-select/CoinSelect';
import Card from './../card/Card';
import classes from './Arena.module.css';

export default function Arena() {
  const [bet, setBet] = useState({ value: 0, coin: 'monsta' });
  const [maxBet, setMaxBet] = useState(3045.98);
  const [minBet, setMinBet] = useState(0.00001);
  const [winningChance, setWinningChance] = useState(22.2);
  const [prize, setPrize] = useState(32.83);

  const card1 = new CardEntity({ name: 'Yetimon', winner: true, points: 68, lvl: 20 });
  const card2 = new CardEntity({ name: 'Dragomon', winner: false, points: 154, lvl: 20 });

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
          <div className={classes.bet}>
            <span className={classes.label}>Your Bet :</span>
            <CoinSelect
              stepValue={0.1}
              maxValue={maxBet}
              minValue={minBet}
              onCoinChange={onBetCoinChange.bind(this)}
              onValueChange={onBetValueChange.bind(this)}
            />
          </div>

          <div className={classes.row}>
            <span>Max bet</span>
            <span className={classes.highlight}>{maxBet} ${bet.coin}</span>
          </div>

          <div className={classes.row}>
            <span>Winning chance</span>
            <span className={classes.highlight}>{winningChance} %</span>
          </div>

          <div className={classes.row}>
            <span>Prize</span>
            <span className={[classes.highlight, classes.prize].join(' ')}>{prize} ${bet.coin}</span>
          </div>
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
