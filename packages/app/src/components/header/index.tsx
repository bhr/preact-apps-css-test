import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";
import style from "./style.css";
import clsx from 'clsx'

const Header: FunctionalComponent = () => {
    return (
        <header className={clsx(style.header)}>
            <h1>Preact App</h1>
            <nav>
                <Link activeClassName={clsx(style.active)} href="/">
                    Home
                </Link>
                <Link activeClassName={clsx(style.active)} href="/profile">
                    Me
                </Link>
                <Link activeClassName={clsx(style.active)} href="/profile/john">
                    John
                </Link>
            </nav>
        </header>
    );
};

export default Header;
