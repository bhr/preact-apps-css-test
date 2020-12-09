import { FunctionalComponent, h } from "preact";
import style from './style.css';
import clsx from 'clsx';

import Simple from '@vestico/common/lib/components/Simple';

const Home: FunctionalComponent = () => {

    return (
        <div className={clsx(style.home)}>
          <p className={clsx(style.test)}>Hello World</p>
          <Simple />
        </div>
    );
};

export default Home;