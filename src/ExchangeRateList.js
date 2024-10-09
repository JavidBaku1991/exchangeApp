import React, { Component } from 'react';

class ExchangeRateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseCurrency: 'EUR',
      rates: {},
      currencies: {}, 
    };
  }

  componentDidMount() {
    this.fetchCurrencies(); 
    this.fetchRates(this.state.baseCurrency); 
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.baseCurrency !== this.state.baseCurrency) {
      this.fetchRates(this.state.baseCurrency); 
    }
  }

  fetchCurrencies = () => {
    fetch('https://api.frankfurter.app/currencies')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ currencies: data });
      })
      .catch((error) => console.error('Error fetching currencies:', error));
  };

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
    const { rates, baseCurrency, currencies } = this.state;
    return (
      <div>
        <h2>Exchange Rates for {baseCurrency}</h2>

        <label htmlFor="base-currency">Select Base Currency: </label>
        <select
          id="base-currency"
          onChange={this.handleBaseCurrencyChange}
          value={baseCurrency}
        >
          {Object.entries(currencies).map(([code, name]) => (
            <option key={code} value={code}>
              {name} ({code})
            </option>
          ))}
        </select>

        <ul>
          {Object.entries(rates).map(([currency, rate]) => (
            <li key={currency}>
              {currency}: {rate.toFixed(4)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ExchangeRateList;
