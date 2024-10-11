import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './ExchangeRateList.css'; // Import the CSS file

// Register necessary chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

class ExchangeRateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseCurrency: 'EUR',
      rates: {},
      currencies: {},
      chartData: {}, // For chart data
    };
  }

  componentDidMount() {
    this.fetchCurrencies();
    this.fetchRates(this.state.baseCurrency);
    this.fetchChartData(this.state.baseCurrency, 'USD'); // Example: Chart for EUR to USD
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.baseCurrency !== this.state.baseCurrency) {
      this.fetchRates(this.state.baseCurrency);
      this.fetchChartData(this.state.baseCurrency, 'USD'); // Update chart data when base changes
    }
  }

  // Fetch available currencies
  fetchCurrencies = () => {
    fetch('https://api.frankfurter.app/currencies')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ currencies: data });
      })
      .catch((error) => console.error('Error fetching currencies:', error));
  };

  // Fetch exchange rates based on the base currency
  fetchRates = (base) => {
    fetch(`https://api.frankfurter.app/latest?from=${base}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ rates: data.rates });
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  // Fetch chart data for the selected currency pair
  fetchChartData = (base, target) => {
    const today = new Date().toISOString().split('T')[0];
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoDate = oneMonthAgo.toISOString().split('T')[0];

    fetch(`https://api.frankfurter.app/${oneMonthAgoDate}..${today}?from=${base}&to=${target}`)
      .then((response) => response.json())
      .then((data) => {
        const labels = Object.keys(data.rates);
        const rates = labels.map((date) => data.rates[date][target]);

        this.setState({
          chartData: {
            labels: labels,
            datasets: [
              {
                label: `${base} to ${target}`,
                data: rates,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4, // Adds smooth curves to the chart line
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Fancy point color
                pointBorderColor: 'rgba(255, 255, 255, 1)',
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(0, 123, 255, 1)', // Hover effect on points
                borderWidth: 2, // Thicker line
              },
            ],
          },
        });
      })
      .catch((error) => console.error('Error fetching chart data:', error));
  };

  handleBaseCurrencyChange = (event) => {
    this.setState({ baseCurrency: event.target.value });
  };

  render() {
    const { rates, baseCurrency, currencies, chartData } = this.state;

    return (
      <div className="exchange-rate-list">
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

        <ul className="rate-list">
          {Object.entries(rates).map(([currency, rate]) => (
            <li key={currency}>
              {currency}: {rate.toFixed(4)}
            </li>
          ))}
        </ul>

        {chartData.labels && (
          <div className="chart-container">
            <h3>Currency Chart: {baseCurrency} to USD</h3>
            <Line
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: '#333', // Text color
                      font: {
                        size: 14,
                      },
                    },
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    titleFont: {
                      size: 14,
                    },
                    bodyFont: {
                      size: 12,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: true, // Hide x-axis grid
                    },
                    ticks: {
                      color: '#555', // Customize x-axis tick color
                    },
                  },
                  y: {
                    grid: {
                      color: '#ddd', // Light y-axis grid color
                    },
                    ticks: {
                      color: '#555', // Customize y-axis tick color
                    },
                  },
                },
                maintainAspectRatio: false, // Allow resizing
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ExchangeRateList;
