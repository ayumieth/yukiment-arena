import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RiSwordFill } from 'react-icons/ri';
import arenaBattleABI from '../../consts/arenaBattle.json';
import yukimentNftABI from '../../consts/yukimentNftABI.json';
import yukiTokenABI from '../../consts/yukiTokenABI.json';
import { getBalance, getContract, getMaxPlay, getTokenURI, getTraits, getYukiment } from '../../utils/callHelpers';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { getFullDisplayBalance } from '../../utils/formatBalance';
import { setPlayer } from '../../redux/battle/battle.slice';
import classes from './Selection.module.css';

const arenaBattleAddr = '0x77B31214EEa8a254bFc9A49e6Ccb91eEFb4D8912';
const yukiTokenAddr = '0x359ddFE514678853e1e58C6130f1F12C636E3a89';
const yukimentNftAddr = '0x74c88fbFD5666c66FEFd82FE8D7F084111BfE872';

const YukiCard = ({ id, times, web3, onMint }) => {

  const [url, setUrl] = useState("")
  useEffect(() => {
    if (web3 !== null && id !== -1) {
      const contract = getContract(web3, yukimentNftABI, yukimentNftAddr);
      getTokenURI(contract, id).then(res => {
        setUrl(res.image)
      })
    }
  }, [id])

  return (
    <div className={classes['card-wrapper']}>
      <div className={classes.card}>
        <div className={classes['card__title']}>
          <span>
            {id === -1 ? 'Unknown' : `Yukiment${id}`}
          </span>
        </div>
        {id !== -1 ?
          <>
            <img className={classes['card__picture']} alt="Yukiment 1" src="./assets/monsters/yukiment-wind.png" />
            <button disabled={times === 0} className={classes.button} onClick={() => onMint(id, times, url)}>{`Select: ${times} left`}</button>
          </> :
          <div className={classes.unknown}>
            ?
          </div>
        }
      </div>
    </div>
  )
}

export default function Selection() {
  const [playerYukis, setPlayerYukis] = useState([[-1, -1, -1, -1], [0, 0, 0, 0]]);
  const [balance, setBalance] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const { web3, account, onConnect } = useWalletConnect();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onMint = async (_tokenID, times, _url) => {
    alert(`Selecting ${_tokenID} ...`);
    const nftContract = getContract(web3, yukimentNftABI, yukimentNftAddr);
    const [_element, _power] = await getTraits(nftContract, _tokenID);
    const _times = playerYukis
    dispatch(setPlayer({ _tokenID, _times: times, _element, _power, _url }));
    navigate('battle');
  }

  const filterAddress = () => {
    return account.slice(0, 5) + '...' + account.slice(38, 42)
  }

  const getInfo = async () => {
    const tokContract = getContract(web3, yukiTokenABI, yukiTokenAddr);
    const battleContract = getContract(web3, arenaBattleABI, arenaBattleAddr);
    setMaxTime(await getMaxPlay(battleContract));
    setBalance(await getBalance(tokContract, account));
    setPlayerYukis(await getYukiment(battleContract, account));
  }

  useEffect(() => {
    if (account !== null) {
      getInfo();
    }
  }, [account])

  return (
    <div className={classes.selection}>
      <div className={classes.wallet}>
        <div className={classes.button}>
          Balance: {getFullDisplayBalance(balance)} Yuki
        </div>
        <div className={classes.button} onClick={onConnect}>
          {account ? filterAddress(account) : 'Connect Wallet'}
        </div>
      </div>
      <div className={classes.head}>
        <h1 className={classes.title}>Yukiments Arena</h1>
        <p className={classes.subtitle}>Fight or die!</p>
      </div>

      <div className={classes.body}>
        <div className={classes.heading}>
          <span>Select your Yukiment</span> <RiSwordFill /> <span>Choose wisely</span>
        </div>

        <div className={classes.content}>
          {playerYukis[0].length > 0 ? playerYukis[0].map((item, index) => {
            return (
              <YukiCard id={item} times={maxTime - playerYukis[1][index]} web3={web3} onMint={onMint} key={index} />
            )
          }) :
            <div className={classes.empty}>
              You don't have Yukiment NFT to start with.
            </div>}
        </div>
      </div>
    </div>
  )
}
