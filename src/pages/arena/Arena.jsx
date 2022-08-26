import { useEffect, useState } from 'react';

import Card from '../../components/card/Card';
import CoinSelect from '../../components/coin-select/CoinSelect';
import CardEntity from '../../entities/card.entity';

import { RiSwordFill } from 'react-icons/ri'

import classes from './Arena.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { boostPlayer, enterGame, getContract, getWinningChance, startFight, skipEnemy, getPlayerInfo } from '../../utils/callHelpers';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { getBalanceNumber } from '../../utils/formatBalance';
import { getBalance } from '../../utils/callHelpers';
import arenaBattleABI from '../../consts/arenaBattle.json';
import yukiTokenABI from '../../consts/yukiTokenABI.json';
import yukiNftABI from '../../consts/yukimentNftABI.json';
const arenaBattleAddr = '0x77B31214EEa8a254bFc9A49e6Ccb91eEFb4D8912';
const yukiTokenAddr = '0x359ddFE514678853e1e58C6130f1F12C636E3a89';
const yukiNftAddr = '0x74c88fbFD5666c66FEFd82FE8D7F084111BfE872';

export default function Arena() {
  const dispatch = useDispatch();
  const { tokenID, times, element, power } = useSelector((state) => state.battle);
  const { web3, account } = useWalletConnect();
  const [tokContract, nftContract, battleContract] = [
    getContract(web3, yukiTokenABI, yukiTokenAddr),
    getContract(web3, yukiNftABI, yukiNftAddr),
    getContract(web3, arenaBattleABI, arenaBattleAddr)]

  const [loading, setLoading] = useState(false);
  const [maxBet, setMaxBet] = useState(1);
  const [winningChance, setWinningChance] = useState(100);

  const [betFlag, setBetFlag] = useState(false);
  const [bet, setBet] = useState({ value: 1, coin: 'monsta' });
  const [betting, setBetting] = useState(false);
  const [fighting, setFighting] = useState(false);


  const [playerCard, setPlayerCard] = useState(new CardEntity());
  const [opponentCard, setOpponentCard] = useState(new CardEntity());

  const [skipTimes, setSkipTimes] = useState(0);
  const [boostTimes, setBoostTimes] = useState(0);

  const onBetValueChange = e => {
    setBet({ ...bet, value: e });
  }

  const onBetCoinChange = e => {
    setBet({ ...bet, coin: e });
  }

  const onBet = () => {
    setLoading(true)
    enterGame(battleContract, arenaBattleAddr, tokContract, nftContract, account, tokenID, bet.value, playerCard, setLoading, setOpponentCard, setBetFlag, setBetting, setSkipTimes, setBoostTimes, setPlayerCard, dispatch)
  }

  const onFight = () => {
    setFighting(true)
    startFight(battleContract, tokContract, nftContract, account, tokenID, times, setFighting, setPlayerCard, setOpponentCard, setBetFlag, setBetting)
  }

  const onSkip = async () => {
    setLoading(true)
    try {
      skipEnemy(battleContract, nftContract, tokenID, account, setSkipTimes, setWinningChance, setLoading, setOpponentCard)
    } catch (err) {
      console.log("error:", err)
    }
  }

  const onBoost = async () => {
    try {
      boostPlayer(battleContract, tokenID, account, setBoostTimes, playerCard, setPlayerCard)
    } catch (err) {
      console.log("error:", err)
    }
  }

  useEffect(() => {
    if (account) {
      setPlayerCard({ tokenId: tokenID, name: `Yukiment ${tokenID}`, times: times, image: './assets/monsters/yukiment-wind.png', power: power, element: element })
      getBalance(tokContract, arenaBattleAddr).then(res => {
        setMaxBet(getBalanceNumber(res / 10).toFixed(1))
      })
      getPlayerInfo(battleContract, account).then(res => {
        setSkipTimes(res.skipChance);
        setBoostTimes(res.boostChance);
      })
    }
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
                  minValue={0}
                  onCoinChange={onBetCoinChange.bind(this)}
                  onValueChange={onBetValueChange.bind(this)}
                />
            }
          </div>

          <div className={classes.row}>
            <span>Max Bet:</span>
            <span className={classes.highlight}>{maxBet} ${bet.coin}</span>
          </div>

          <div className={classes.row}>
            <span>Winning Chance:</span>
            <span className={classes.highlight}>{winningChance} %</span>
          </div>

          <div className={classes.row}>
            <span>Prize:</span>
            <span className={[classes.highlight, classes.prize].join(' ')}>{bet.value}~{2 * bet.value} ${bet.coin}</span>
          </div>
        </div>

        <div className={classes.controls}>
          {
            betting ?
              <span className={classes.note}>Betting...</span> :
              betFlag ?
                <>
                  <div className={classes.button} onClick={onFight}>Fight</div>
                  <div><a className={classes.link} onClick={onSkip}>Skip: {skipTimes} times remaining</a></div>
                  <a className={classes.link} onClick={onBoost}>Boost: {boostTimes} times remaining</a>
                </> :
                <div className={loading || playerCard.times <= 0 || !playerCard.times ? classes.dbutton : classes.button} onClick={onBet}>Bet</div>
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