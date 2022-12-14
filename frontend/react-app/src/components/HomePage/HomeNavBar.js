import React from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import HomeNavBars from "../../css/HomeNavBar.css"
import logoIcon from "../../css/images/risinghoodblackicon.png"
import searchIcon from "../../css/images/searchIcon.svg"

const HomeNavBar = () => {
  return (
  <div className="home-nav-container">

          <div className="home-logo-container">
             <NavLink to= '/home'><img src={logoIcon} alt='logo' /> </NavLink>
          </div>

          <div className="home-search-bar-container">
            <div className="home-search-bar">
                <div className='home-left-search-box'>
                  <img src={searchIcon} alt='search' />
                </div>
                <div className="home-main-search-input">
                    <form>
                    <label></label>

                    <input
                    name="search-bar"
                    placeholder="Search"
                    />
                    </form>

                </div>
            </div>
          </div>
          <div className="home-nav-links">
            <NavLink className="home-link" to='/stocks/AAPL'> Rewards</NavLink>
            <NavLink className="home-link"to='/stocks/TSLA'> Investing</NavLink>
            <NavLink className="home-link"to='/stocks/GM'> Spending</NavLink>
            <NavLink className="home-link"to='/stocks/GOOGL'> Retirement</NavLink>
            <NavLink className="home-link"to='/stocks/AMC'> Notifications</NavLink>
            <NavLink className="home-link" to='/stocks/GME'> Account</NavLink>
          </div>
        </div>

  );
};

export default HomeNavBar;
