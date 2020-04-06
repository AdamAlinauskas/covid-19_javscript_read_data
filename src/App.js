import React, { Component } from "react";
import axios from "axios";

export default class App extends Component {
  state = {
    countries: [],
    total: 0,
  };

  async componentDidMount() {
    const result = await axios.get(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
    );

    const data = result.data.split("\n");
    const header = data[0].split(",");
    const row = data[1].split(",");
    console.log(header[0]);
    console.log(row[1]);
    console.log(row[row.length - 1]);
    console.log("**********************************");

    const countries = [];
    let allCountryTotal = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i].split(",");
      const countryName = row[1];
      const total = Number(row[row.length - 1]);
      const foundCountry = countries.filter((x) => x.name === countryName);

      if (foundCountry.length === 0) {
        countries.push({ name: countryName, total: total });
        allCountryTotal += total;
      } else {
        foundCountry[0].total = foundCountry[0].total + total;
      }
    }

    // console.log(countries.length);
    // console.table(countries);

    this.setState({ countries, total: allCountryTotal });

    // for (let item in country) {
    // }
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const { countries, total } = this.state;

    return (
      <div>
        <h1 style={{ textAlign: "center" }}>
          All country total: {this.numberWithCommas(total)}
        </h1>
        <hr></hr>
        {countries.length >= 1 ? (
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Country</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr>
                  <td>{c.name}</td>
                  <td>{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        )}
      </div>
    );
  }
}
