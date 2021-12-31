import { RiSwordFill } from 'react-icons/ri';
import classes from './Selection.module.css';

export default function Selection() {
  const onMint = (monster) => {
    alert(`Minting ${monster} ...`);
    window.location.href = 'battle';
  }

  return (
    <div className={classes.selection}>
      <div className={classes.head}>
        <h1 className={classes.title}>Metavverse Slayer</h1>
        <p className={classes.subtitle}>Team up to protect the Metaberse!</p>
      </div>

      <div className={classes.body}>
        <div className={classes.heading}>
          <span>Mint your hero</span> <RiSwordFill /> <span>Choose wisely</span>
        </div>

        <div className={classes.content}>
          <div className={classes['card-wrapper']}>
            <div className={classes.card}>
              <div className={classes['card__title']}>
                <span>Yetimon 1</span>
              </div>

              <img className={classes['card__picture']} alt="Yetimon 1 picture" src="./assets/monsters/yetimon.png" />
              <button className={classes.button} onClick={() => onMint('Yetimon 1')}>Mint</button>
            </div>
          </div>

          <div className={classes['card-wrapper']}>
            <div className={classes.card}>
              <div className={classes['card__title']}>
                <span>Dragomon 1</span>
              </div>

              <img className={classes['card__picture']} alt="Dragomon 1 picture" src="./assets/monsters/dragomon.png" />
              <button className={classes.button} onClick={() => onMint('Dragamon 1')}>Mint</button>
            </div>
          </div>

          <div className={classes['card-wrapper']}>
            <div className={classes.card}>
              <div className={classes['card__title']}>
                <span>Yetimon 2</span>
              </div>

              <img className={classes['card__picture']} alt="Yetimon 2 picture" src="./assets/monsters/yetimon.png" />
              <button className={classes.button} onClick={() => onMint('Yetimon 2')}>Mint</button>
            </div>
          </div>

          <div className={classes['card-wrapper']}>
            <div className={classes.card}>
              <div className={classes['card__title']}>
                <span>Dragomon 2</span>
              </div>

              <img className={classes['card__picture']} alt="Dragomon 2 picture" src="./assets/monsters/dragomon.png" />
              <button className={classes.button} onClick={() => onMint('Dragamon 2')}>Mint</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
