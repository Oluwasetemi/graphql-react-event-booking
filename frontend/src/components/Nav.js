import React from 'react';
import { NavLink } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import AuthContext from '../context/auth-context';

const Global = createGlobalStyle`
  body {
    background-color: #E5E5E5;
  }
  .main-navigation {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 5rem;
    background: #01d1d1;
    padding: 0 1rem;
    display: flex;
    align-items: center;
  }
  .main-navigation__logo {
    margin: 0;
    font-size: 1.5em;
  }
  .main-navigation__logo h1 {
    margin-top: 1.3rem;
  }

  .main-navigation__item {
    margin-left: 2.5rem;
  }
  .main-navigation__item ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .main-navigation__item li {
    margin: 0 1rem;
  }

  .main-navigation__item a {
    text-decoration: none;
    color: #000;
  }

  .main-navigation__item a:hover,
  .main-navigation__item a:active,
  .main-navigation__item a.active {
    color: #f8e264;
  }
`;


const Nav = (props) => {
  return (
    <div>
      <AuthContext.Consumer>
        {(context) => {
          return (
            <>
              <Global/>
              <header className="main-navigation">
                <div className="main-navigation__logo">
                  <h1>Tryve Events</h1>
                </div>
                <nav className="main-navigation__item">
                  <ul>
                    {!context.token && <li>
                      <NavLink to="/auth" >Authenticate</NavLink>
                    </li>}
                    <li>
                      <NavLink to="/events" >Events</NavLink>
                    </li>
                    {context.token && <li>
                      <NavLink to="/bookings" >Bookings</NavLink>
                    </li>}
                  </ul>
                </nav>
              </header>
            </>
          )
        }}
      </AuthContext.Consumer>
    </div>
  )
}

export default Nav;