import classes from './Card.module.css';

export default function Card(props) {
  const img = 'assets/monsters/' + props.card?.name?.toLowerCase() + '.png';
  const status = props.card?.winner ? 'winner' : 'loser';
  const classkey = `card--${status}`;

  return (
    <div>
      <div className={classes['card-points']}>{props.card.points}</div>

      <div className={[classes.card, classes[classkey]].join(' ')}>
        <div className={classes.card__head}>
          <div className={classes.chip}>
            <span>{props.card.name}</span>
            <span>{props.card.lvl}</span>
          </div>
        </div>

        <div className={classes.card__content}>
          <img className={classes.logo} src={img} alt="Monster" />
        </div>

        <div className={classes.card__foot}>
          <span>{status}!</span>
        </div>
        <div></div>
      </div>
    </div>
  );
}
