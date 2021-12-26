import { FaShieldAlt } from 'react-icons/fa';
import { CgShapeRhombus } from 'react-icons/cg';
import { RiSwordLine } from 'react-icons/ri';

import Tilt from 'react-tilt';

import classes from './Card.module.css';

export default function Card(props) {
  const img = 'assets/monsters/' + props.card?.name?.toLowerCase() + '.png';
  const status = props.card?.winner ? 'winner' : 'loser';
  const classkey = `card--${status}`;

  return (
    <div className={classes.cardWrapper}>
      <div className={classes['card-points']}>Power <span className={classes.highlight}>{props.card.points}</span></div>

      <Tilt className="Tilt" options={{ max: 25, glareEnable: true }} glareEnable={true} >
        <div className={[classes.card, classes[classkey]].join(' ')}>
          <div className={classes.card__head}>
            <div className={classes.chip}>
              <span>{props.card.name}</span>
              <span><FaShieldAlt /> {props.card.lvl}</span>
            </div>
          </div>

          <div className={classes.card__content}>
            <img className={classes.logo} src={img} alt="Monster" />
          </div>

          <div className={classes.meta}>
            <span className={`${classes.metaChip} ${classes['metaChip--energy']}`}><CgShapeRhombus /> 3</span>
            <span className={`${classes.metaChip} ${classes['metaChip--battle']}`}><RiSwordLine /> 3</span>
            <span className={`${classes.metaChip} ${classes['metaChip--number']}`}>15581</span>
          </div>

          <div className={classes.card__foot}>
            <span>{status}!</span>
          </div>
          <div></div>
        </div>
      </Tilt>
    </div>
  );
}
