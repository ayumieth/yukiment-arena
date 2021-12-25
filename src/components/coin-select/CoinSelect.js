import { useEffect, useRef, useState } from 'react';
import classes from './CoinSelect.module.css';

export default function CoinSelect(props) {
  const span = useRef();
  const [width, setWidth] = useState(0);
  const [content, setContent] = useState('');

  const [value, setValue] = useState(0);
  const [coin, setCoin] = useState('monsta');

  const onChange = e => {
    if (e.nativeEvent.isTrusted) {
      const inputValue = parseFloat(e.nativeEvent.target.value);
      const sanitizedValue = isNaN(inputValue) ? 0 : inputValue;

      setValue(sanitizedValue);
    }
  };

  const onSelect = e => {
    if (e.nativeEvent.isTrusted) {
      const value = e.nativeEvent.target.value;
      setCoin(value);
    }
  }

  const onResize = e => {
    setContent(e.target.value);
  };

  useEffect(() => {
    setWidth(span.current.offsetWidth);
  }, [content]);

  useEffect(() => {
    if (props.onValueChange) {
      props.onValueChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (props.onCoinChange) {
      props.onCoinChange(coin);
    }
  }, [coin]);

  return (
    <div className={classes.input}>
      <span className={classes.hide} ref={span}>{content}</span>
      <input
        type="number"
        placeholder="10"
        style={{ width }}
        max={props.maxValue}
        min={props.minValue}
        step={props.stepValue}
        onChange={e => { onResize(e); onChange(e); }}
      />

      <select
        className={classes.select}
        onChange={e => onSelect(e)}
      >
        <option value="monsta">MONSTA</option>
        <option value="bnrg">BNRG</option>
        <option value="bnb">BNB</option>
        <option value="busd">BUSD</option>
      </select>
    </div>
  );
}
