import React, { Component } from 'react';

class ExchangeRateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseCurrency: 'EUR',
      rates: {},
    };
  }

  componentDidMount() {
    this.fetchRates(this.state.baseCurrency);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.baseCurrency !== this.state.baseCurrency) {
      this.fetchRates(this.state.baseCurrency);
    }
  }

  fetchRates = (base) => {
    fetch(`https://api.frankfurter.app/latest?from=${base}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ rates: data.rates });
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  handleBaseCurrencyChange = (event) => {
    this.setState({ baseCurrency: event.target.value });
  };

  render() {
    const { rates, baseCurrency } = this.state;
    return (
      <div>
        <h2>Exchange Rates for {baseCurrency}</h2>
        <select onChange={this.handleBaseCurrencyChange}>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          {/* Add other currency options here */}
        </select>
        <ul>
          {Object.entries(rates).map(([currency, rate]) => (
            <li key={currency}>
              {currency}: {rate.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ExchangeRateList;
