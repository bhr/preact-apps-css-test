import clsx from 'clsx';
import { Fragment, h } from 'preact';
import style from './simple.css'

const Simple = () => {

  return (
    <Fragment>
      <h1>SimpleComponent</h1>
      <div className={clsx(style.roundedRect)}></div>
    </Fragment>
  );
}

export default Simple;
