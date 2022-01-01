import { useEffect, useState } from 'react';

import Card from '../../components/card/Card';
import CoinSelect from '../../components/coin-select/CoinSelect';

import cards from '../../consts/cards.const';
import CardEntity from '../../entities/card.entity';

import { RiSwordFill } from 'react-icons/ri'

import classes from './Arena.module.css';

export default function Arena() {
  const [bet, setBet] = useState({ value: 0, coin: 'monsta' });
  const [maxBet, setMaxBet] = useState(3045.98);
  const [minBet, setMinBet] = useState(0.00001);
  const [winningChance, setWinningChance] = useState(22.2);
  const [prize, setPrize] = useState(32.83);
  const [fighting, setFighting] = useState(false);
  const fightingDuration = 1000;

  const [playerCard, setPlayerCard] = useState(new CardEntity());
  const [opponentCard, setOpponentCard] = useState(new CardEntity());

  const randomizeCards = () => {
    const playerIndex = Math.round(Math.random() * (cards.length - 1));
    const opponentIndex = Math.round(Math.random() * (cards.length - 1));

    setPlayerCard(cards[playerIndex]);
    setOpponentCard(cards[opponentIndex]);
  }

  const onBetValueChange = e => {
    setBet({ ...bet, value: e });
  }

  const onBetCoinChange = e => {
    setBet({ ...bet, coin: e });
  }

  const onFight = () => {
    setFighting(true);

    setTimeout(() => {
      setFighting(false);
      randomizeCards();
    }, fightingDuration);
  }

  const onSkip = () => {
    randomizeCards();
  }

  useEffect(() => {
    randomizeCards();
  }, []);

  useEffect(() => {
    console.log({ bet });
  }, [bet]);

  return (
    <main className={`${classes.arena} ${fighting ? classes['arena--fighting'] : ''}`}>
      <div className={classes.card}>
        <Card card={playerCard} />
      </div>

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

      <div className={classes.battle}>
        <RiSwordFill />
      </div>

      <div className={classes.card}>
        <Card card={opponentCard} />
      </div>
    </main>
  );
}
