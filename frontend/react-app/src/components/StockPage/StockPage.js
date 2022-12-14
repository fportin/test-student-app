import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import HomeNavBar from "../HomePage/HomeNavBar";
import "../../css/StockPage.css";
import addImg from "../../css/images/add.svg";
import { fetchStockInfo, clearStockInfo } from "../../store/stocks";
import { Modal } from "../context/Modal";
import WatchlistStockModal from "./WatchlistStockModal.js";

const StockPage = () => {
  const dispatch = useDispatch();
  const stockInfo = useSelector((state) => state.stocks.stockInfo);
  const watchlists = useSelector((state) => state.lists.watchlists);
  const { stockSymbol } = useParams();
  const [clickedBuyIn, setClickedBuyIn] = useState("Shares");
  const [clickedDropdown, setClickedDropDown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [hasStock, setHasStock] = useState([]);

  useEffect(() => {

      let includedStocks = []
    Object.values(watchlists)?.forEach((watchlist) => {
      if (
        watchlist.stocks.find((stock) => stock.stock_symbol === stockSymbol)
      ) {
        includedStocks.push(watchlist.id)
      }
    });
    setHasStock([...includedStocks])
  }, [watchlists, stockSymbol]);



//   useEffect(() => {

//   }, [hasStock]);

  useEffect(() => {
    dispatch(clearStockInfo());
    dispatch(fetchStockInfo(stockSymbol));
  }, [dispatch, stockSymbol]);

  return (
    <div className="stock-page-container">
      <div className="stock-page-nav">
        <HomeNavBar />
      </div>
      <div className="stock-page-body">
        <div className="first-column">
          <div className="chart-container">
            <div className="chart-header">
              <div className="main-name">{stockSymbol}</div>
              <div className="stock-price">$129.97</div>
              <div className="price-change">-$18.33(-12.36%) Past month</div>
            </div>
            <div className="chart">
              <div className="line-chart"></div>
              <div className="time-period"></div>
            </div>
          </div>
          <div className="stock-info-container">
            <div className="about-title">
              <div className="about">About</div>
            </div>
            <div className="stock-description">
              {stockInfo.stockDescription}
            </div>
            <div className="company-info-container">
              {/* <div className="ceo-container">
                    <div className="ceo-title">CEO</div>
                    <div className="ceo-name">Timothy Donald Cook</div>
                </div> */}
              <div className="employees-container">
                <div className="employees-title">Employees</div>
                <div className="employees-name">{stockInfo.employees}</div>
              </div>
              <div className="headquarters-container">
                <div className="headquarters-title">Headquarters</div>
                <div className="headquarters-name">
                  {stockInfo.headquarters}
                </div>
              </div>
              <div className="founded-container">
                <div className="founded-title">Sector</div>
                <div className="founded-name">{stockInfo.sector}</div>
              </div>
            </div>
            <div className="key-statistics-container">
              <div className="key-statistics-title">Key statistics</div>
              <div className="key-info-container">
                <div className="key-info-title">Market cap</div>
                <div className="key-info-name">{stockInfo.marketCap}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Price-Earnings ratio</div>
                <div className="key-info-name">
                  {stockInfo.priceEarningsRatio}
                </div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Dividend yield</div>
                <div className="key-info-name">{stockInfo.dividendYield}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Average volume</div>
                <div className="key-info-name">{stockInfo.averageVolume}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">High today</div>
                <div className="key-info-name">{stockInfo.highToday}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Low today</div>
                <div className="key-info-name">{stockInfo.lowToday}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Open price</div>
                <div className="employees-name">{stockInfo.openPrice}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">Volume</div>
                <div className="key-info-name">{stockInfo.volume}</div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">52 Week high</div>
                <div className="key-info-name">
                  {stockInfo.fiftyTwoWeekHigh}
                </div>
              </div>
              <div className="key-info-container">
                <div className="key-info-title">52 Week low</div>
                <div className="key-info-name">{stockInfo.fiftyTwoWeekLow}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="second-column">
          <div className="stock-transaction-container">
            <div className="stock-transaction">
              <div className="transaction-header">Buy {stockSymbol}</div>
              <div className="transaction-form">
                <div className="order-type">
                  Order Type <span>Market Order</span>
                </div>
                <div className="buy-in">
                  <span>Buy In </span>
                  <div
                    className="buy-type-dropdown-container"
                    onClick={() => setClickedDropDown(!clickedDropdown)}
                  >
                    {clickedBuyIn}
                  </div>
                  {clickedDropdown && (
                    <div className="buy-type-dropdown">
                      <div className="Shares">Shares</div>
                      <div className="Dollars">Dollars</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="add-stock-watchlist"
              onClick={() => setShowAddModal(true)}
            >
              <div className="add-stock-button">Add to Lists</div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
            {console.log(hasStock, "HASSSSSS STOCKKkk STOCK PAGE")}
          <WatchlistStockModal
            hasStock={hasStock}
            setShowAddModal={setShowAddModal}
            stockSymbol={stockSymbol}
            setHasStock={setHasStock}
          />
        </Modal>
      )}
    </div>
  );
};

export default StockPage;
