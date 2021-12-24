import classes from './Header.module.css';

export default function Header() {
  return (
    <nav className={classes.header}>
      <div className={classes.wrapper}>
        <div
          className={[classes.items, classes['items--left']].join(' ')}
        >
          <div className={classes.item}>
            <img className={classes.item__icon} src="./assets/icons/shop.png" alt="Shop Icon" />
            <span className={classes.item__label}>Shop</span>
          </div>

          <div className={classes.item}>
            <img className={classes.item__icon} src="./assets/icons/collection.png" alt="Trade Icon" />
            <span className={classes.item__label}>Collection</span>
          </div>
        </div>

        <div className={[classes.items, classes['items--center']].join(' ')}>
          <img className={classes.item__logo} src="./assets/logo.png" alt="App Logo" />
        </div>

        <div className={[classes.items, classes['items--right']].join(' ')}>
          <div className={classes.item}>
            <img className={classes.item__icon} src="./assets/icons/battle.png" alt="Battle Icon" />
            <span className={classes.item__label}>Battle</span>
          </div>

          <div className={classes.item}>
            <img className={classes.item__icon} src="./assets/icons/rewards.png" alt="Rewards Icon" />
            <span className={classes.item__label}>Rewards</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
