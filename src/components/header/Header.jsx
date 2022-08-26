import classes from './Header.module.css';
import { buyItem, claimReward, getContract } from '../../utils/callHelpers';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import arenaBattleABI from '../../consts/arenaBattle.json';
import yukiTokenABI from '../../consts/yukiTokenABI.json';
const arenaBattleAddr = '0x47e0c620269771F12750343f742906ACC7E2B379';
const yukiTokenAddr = '0x359ddFE514678853e1e58C6130f1F12C636E3a89';

export default function Header() {
  const { web3, account } = useWalletConnect()
  const battleContract = getContract(web3, arenaBattleABI, arenaBattleAddr)
  const tokContract = getContract(web3, yukiTokenABI, yukiTokenAddr)

  const onReward = () => {
    claimReward(battleContract, account)
  }

  const onBuyItem = (type) => {
    buyItem(battleContract, tokContract, account, type)
  }

  return (
    <nav className={classes.header}>
      <div className={classes.wrapper}>
        <div
          className={classes.items}
        >
          <div className={classes.item}>
            <a className={classes.item} onClick={() => onBuyItem(0)}>
              <img className={classes.item__icon} src="./assets/icons/shop.png" alt="Shop Icon" />
              <span className={classes.item__label}>Shop</span>
            </a>
          </div>

          <div className={classes.item}>
            <a className={classes.item} onClick={() => onBuyItem(1)}>
              <img className={classes.item__icon} src="./assets/icons/collection.png" alt="Collections Icon" />
              <span className={classes.item__label}>Collection</span>
            </a>
          </div>

          <div className={classes.item}>
            <a className={classes.item}>
              <img className={classes.item__icon} src="./assets/icons/rewards.png" alt="Rewards Icon" />
              <span className={classes.item__label}>Rewards</span>
            </a>
          </div>

          <div className={classes.item}>
            <img className={classes.item__icon} src="./assets/icons/battle.png" alt="Battle Icon" />
            <span className={classes.item__label}>Battle</span>
          </div>

          <div className={classes.item}>
            <img className={classes.item__icon} src="./assets/icons/ranking.png" alt="Ranking Icon" />
            <span className={classes.item__label}>Ranking</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
