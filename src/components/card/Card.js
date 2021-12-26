import { FaShieldAlt } from 'react-icons/fa';
import { CgShapeRhombus } from 'react-icons/cg';
import { RiSwordLine } from 'react-icons/ri';

import Tilt from 'react-tilt';

import classes from './Card.module.css';

export default function Card(props) {
  const status = props.card?.winner ? 'winzner' : 'loserz';
  const classkey = `card--${status}`;

  return (
    <div className={classes.cardWrapper}>
      <div className={classes['card-points']}>Power <span className={classes.highlight}>{props.card?.power}</span></div>

      <Tilt className="Tilt" options={{ max: 25, glareEnable: true }} glareEnable={true} >
        <div className={[classes.card, classes[classkey]].join(' ')}>
          <div className={classes.card__head}>
            <div className={classes.chip}>
              <span>{props.card?.name}</span>
              <span><FaShieldAlt /> {props.card?.defense}</span>
            </div>
          </div>

          <div className={classes.card__content}>
            <img className={classes.logo} src={props.card?.image} alt="Monster" />
          </div>

          <div className={classes.meta}>
            <span className={`${classes.metaChip} ${classes['metaChip--energy']}`}><CgShapeRhombus /> {props.card?.energy}</span>
            <span className={`${classes.metaChip} ${classes['metaChip--battle']}`}><RiSwordLine /> {props.card?.offense}</span>
            <span className={`${classes.metaChip} ${classes['metaChip--number']}`}>{props.card?.number}</span>
          </div>

          <div className={classes.card__foot}>
            <span>{status}!</span>
          </div>
        </div>
      </Tilt>

      <div className={classes['algo-cost']}>Algorithmic Cost <span className={classes.highlight}>{props.card?.cost?.toFixed(2)} USD</span></div>
    </div>
  );
}
