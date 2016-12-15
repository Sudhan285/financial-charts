# [Angular 2 Full Stack Financial Charts Program](https://financial-charts.herokuapp.com/)

This project is a full stack financial charting application. It is used to graph historical and current stock and currency exchange information.

##How to Use

###Stocks
To get started, please enter the code from any major stock market. The financial data for the previous year will be charted, along with the most recent close figure. The timeframe can be changed by clicking the buttons in the top left corner. You can enter multiple stocks to compare. The stocks will be saved to local storage, so they will automatically be displayed the next time you visit. To remove a stock, simply click the 'X'.

![](http://sschapman.com/img/gifs/stocks.gif)


###Currency Exchange
Please enter an amount, a base currency and the currency to compare it to. If you would like to save these currencies for next time, please click 'Set as default.' The exchange value will display below the inputs as well as a chart showing the exchange rate for this day on each of the previous 12 months. (The API requires a call for every day that you look up, so I chose to do 1 day a month for 12 months.) Upon changing the inputs, the values and chart will update automatically.
![](http://sschapman.com/img/gifs/fex.gif)

##Tools

The front-end of this project was generated with [Angular CLI](https://github.com/angular/angular-cli).

* [Express.js](http://expressjs.com): backend framework
* [Angular 2](https://angular.io): frontend framework
* [Node.js](https://nodejs.org): runtime environment
* [Angular CLI](https://cli.angular.io): project scaffolding
* [ChartJs](http://www.chartjs.org/): graphing library
* [Ng2-Charts](https://github.com/valor-software/ng2-charts): converts ChartJS to Angular 2 format
* [Quandl Financial API](https://www.quandl.com): used for stock data
* [Fixer.io Exchange Rate API](http://fixer.io): used for exchange rate data
* [Bootstrap](http://www.getbootstrap.com): layout and styles
* [Font Awesome](http://fontawesome.io): icons

## Prerequisites
1. Install [Node.js](https://nodejs.org)
2. Install Angular CLI: `npm i angular-cli -g`
3. From project root folder install all the dependencies: `npm i`

## Run
1. Command window 2: `ng build -w`: build the project and keep watching the files for changes
2. Command window 3: `npm start`: run Express server
3. Go to [localhost:3000](http://localhost:3000)

## Production
Run `ng build -prod` to create a production ready bundle.

## Please open an issue if
* you have any suggestions or advice to improve this project.
* you noticed any problem or error.

## To Do
tests are still to be implemented
