import './Card.css';

export default function Card(props) {
  const img = 'assets/monsters/' + props.card?.name?.toLowerCase() + '.png';
  const status = props.card?.winner ? 'Winner' : 'Loser';

  return (
    <div>
      <div className="Card-Points">{props.card.points}</div>

      <div className={'Card Card--' + status}>
        <div className="Card__Head">
          <div className="Card__Head__Chip">
            <span>{props.card.name}</span>
            <span>{props.card.lvl}</span>
          </div>
        </div>

        <div className="Card__Content">
          <img className="Card__Content__Logo" src={img} alt="Monster" />
        </div>

        <div className="Card__Foot">
          <span>{status}!</span>
        </div>
        <div></div>
      </div>
    </div>
  );
}
