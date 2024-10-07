import React, { Component } from 'react';

class CurrencyConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      amount: 1,
      conversionRate: 1,
    };
  }

  componentDidMount() {
    this.fetchConversionRate();
  }

  componentDidUpdate( prevState) {
    if (
      prevState.fromCurrency !== this.state.fromCurrency || prevState.toCurrency !== this.state.toCurrency
    ) {
      this.fetchConversionRate();
    }
  }

  fetchConversionRate = () => {
    const { fromCurrency, toCurrency } = this.state;
    fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ conversionRate: data.rates[toCurrency] });
      })
      .catch((error) => console.error('Error fetching conversion rate:', error));
  };

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleCurrencyChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { amount, fromCurrency, toCurrency, conversionRate } = this.state;
    return (
      <div>
        <h2>Currency Converter</h2>
        <input
          type="number"
          value={amount}
          onChange={this.handleAmountChange}
        />
        <select name="fromCurrency" value={fromCurrency} onChange={this.handleCurrencyChange}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <span> to </span>
        <select name="toCurrency" value={toCurrency} onChange={this.handleCurrencyChange}>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
        <h3>
          {amount} {fromCurrency} = {(amount * conversionRate).toFixed(2)} {toCurrency}
        </h3>
      </div>
    );
  }
}

export default CurrencyConverter;
