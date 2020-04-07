import React, { Component } from "react";
import axios from "axios";

export default class App extends Component {
  state = {
    countries: [],
    total: 0,
    sortByActive: false,
  };

  async componentDidMount() {
    const result = await axios.get(
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv"
    );

    const data = result.data.split("\n");
    const header = data[0].split(",");
    const row = data[1].split(",");
    console.log(header[0]);

    console.log(row[1]);
    console.log(row[row.length - 1]);
    console.log("**********************************");

    let countries = [];
    let allCountryTotal = 0;

    for (let i = 1; i < data.length; i++) {
      // prettier-ignore
      const row = data[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const countryName = row[0];
      const total = Number(row[4]);
      const foundCountry = countries.filter((x) => x.name === countryName);

      if (countryName != null && countryName != "") {
        countries.push({
          name: countryName.replace(/"/g, ""),
          total: total,
        });
        allCountryTotal += total;
      }
    }

    let isDescendng = true;

    // countries.sort(this.sortByTotal);

    // countries.sort((countryA, countryB) => {
    //   if (countryA.name > countryB.name) return 1;
    //   else if (countryA.name < countryB.name) return -1;
    //   else return 0;
    // });

    this.setState({ countries, total: allCountryTotal });
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  sortByName = (countryA, countryB) => {
    if (countryA.name > countryB.name) return 1;
    else if (countryA.name < countryB.name) return -1;
    else return 0;
  };

  sortByTotal = (countryA, countryB) => {
    if (countryA.total < countryB.total) return 1;
    else if (countryA.total > countryB.total) return -1;
    else return 0;
  };

  handleSortByTotal = (event) => {
    event.preventDefault();
    const countries = [...this.state.countries];
    countries.sort(this.sortByTotal);
    this.setState({ countries });
  };

  handleSortByName = (event) => {
    event.preventDefault();
    const countries = [...this.state.countries];
    countries.sort(this.sortByName);
    this.setState({ countries });
  };

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
                <th>
                  <a href="/" onClick={this.handleSortByName}>
                    Country
                  </a>
                </th>
                <th>
                  <a href="/" onClick={this.handleSortByTotal}>
                    Total
                  </a>{" "}
                </th>
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
