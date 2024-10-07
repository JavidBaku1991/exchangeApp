import React, { Component } from 'react';
import ExchangeRateList from './ExchangeRateList';
import CurrencyConverter from './CurrencyConverter';
import Navbar from './Navbar';
import Footer from './Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h1>Currency Exchange App</h1>
            <CurrencyConverter />
             <ExchangeRateList />
       
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
