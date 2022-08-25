import { useEffect, useState } from 'react';

import Card from '../../components/card/Card';
import CoinSelect from '../../components/coin-select/CoinSelect';

import cards from '../../consts/cards.const';
import CardEntity from '../../entities/card.entity';

import { RiSwordFill } from 'react-icons/ri'

import classes from './Arena.module.css';
import { useSelector } from 'react-redux';
import { enterGame, chooseEnemy, getContract, getWinningChance, startFight, payForSkip } from '../../utils/callHelpers';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { getBalanceNumber, getFullDisplayBalance } from '../../utils/formatBalance';
import { getBalance } from '../../utils/callHelpers';
import arenaBattleABI from '../../consts/arenaBattle.json';
import yukiTokenABI from '../../consts/yukiTokenABI.json';
import yukiNftABI from '../../consts/yukimentNftABI.json';
const arenaBattleAddr = '0xCd881dDf3A7FE624a1260925f786Fc87f3c73d1b';
const yukiTokenAddr = '0x3C574c8b56B2E5E3B674Ac595E31F08a425Ae3c9';
const yukiNftAddr = '0xdf3A9D18a8ad4dAF5c37AD2B864e6ebDa7f964e1';

export default function Arena() {
  const { tokenID, element, power, imageURL } = useSelector((state) => state.battle);
  const { web3, account } = useWalletConnect();
  const [tokContract, nftContract, battleContract] = [
    getContract(web3, yukiTokenABI, yukiTokenAddr),
    getContract(web3, yukiNftABI, yukiNftAddr),
    getContract(web3, arenaBattleABI, arenaBattleAddr)]
  
  const [loading, setLoading] = useState(false);
  const [maxBet, setMaxBet] = useState(1);
  const [minBet, setMinBet] = useState(0);
  const [winningChance, setWinningChance] = useState(100);
  
  const [betFlag, setBetFlag] = useState(false);
  const [bet, setBet] = useState({ value: 1, coin: 'monsta' });
  const [betting, setBetting] = useState(false);
  const [fighting, setFighting] = useState(false);
  const fightingDuration = 1000;


  const [playerCard, setPlayerCard] = useState(new CardEntity({ tokenId: tokenID, name: `Yukiment ${tokenID}`, image: './assets/monsters/yukiment-wind.png', power: power, element: element }));
  const [opponentCard, setOpponentCard] = useState(new CardEntity());

  const [skipTimes, setSkipTimes] = useState(3);

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

  const onBet = async () => {
    console.log("betting");
    
    setBetting(true);
    await enterGame(battleContract, arenaBattleAddr, tokContract, account, tokenID, web3, web3.utils.toWei(bet.value.toString(), 'ether'), setBetting, setBetFlag);
    
    await chooseEnemy(battleContract, nftContract, account, tokenID, betFlag, setLoading, setOpponentCard).catch(e => {
      setLoading(false);
    });
  }

  const onFight = () => {
    setFighting(true);
    startFight(battleContract, arenaBattleAddr, tokContract, account, tokenID, setFighting);
  }

  const onSkip = () => {
    setLoading(true);
    if(skipTimes > 0) 
      setSkipTimes(skipTimes - 1);
    else {
      alert("You should pay for SKIP");
      payForSkip(battleContract, account);
    }
    chooseEnemy(battleContract, nftContract, account, tokenID, setLoading, setOpponentCard).catch(e => {
      setLoading(false);
    });
  }

  useEffect(() => {
    getBalance(tokContract, arenaBattleAddr).then(res => {
      console.log("arenaBattleAddr.balance: ", res);
      setMaxBet(getBalanceNumber(res/10).toFixed(1))
    })
  }, [])

  useEffect(() => {
    if (opponentCard.name !== "Unknown") {
      getWinningChance(battleContract, tokenID).then(res => {
        setWinningChance(res)
      })
    }
  }, [loading])

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
            {
              betting || betFlag ?
              <div className={classes.label}>{`${bet.value} ${bet.coin}`}</div> :
              <CoinSelect
                stepValue={0.1}
                maxValue={maxBet}
                minValue={minBet}
                onCoinChange={onBetCoinChange.bind(this)}
                onValueChange={onBetValueChange.bind(this)}
              />
            }
          </div>

          <div className={classes.row}>
            <span>Max bet</span>
            <span className={classes.highlight}>{maxBet} ${bet.coin}</span>
          </div>

          <div className={classes.row}>
          </div>

          <div className={classes.row}>
            <span>Prize</span>
            <span className={[classes.highlight, classes.prize].join(' ')}>{bet.value}~{2 * bet.value} ${bet.coin}</span>
          </div>
        </div>

        <div className={classes.controls}>
        {
          betting ?
          <span className={classes.note}>Betting...</span> :
          betFlag ?
          <>
          `${skipTimes} times remaining`
          <div className={classes.button} onClick={onFight}>Fight</div>
          <a className={classes.link} onClick={onSkip}>Skip</a> 
          </> :
          <div className={classes.button} onClick={onBet}>Bet</div>
        }
          
        </div>
      </div>

      <div className={classes.battle}>
        <RiSwordFill />
      </div>

      <div className={classes.card}>
        <Card card={opponentCard} loading={loading} />
      </div>
    </main>
  );
}