# Start-Templete-truffle
start solidity with truffle 

This project `truffle-config.js` support Ethereum (main/test), Binance (main/test), Klaytn (main/test), ganache(local)

## Requirememnts
- node : v 14.19.0
- truffle : v 5.5.18

## Start
Download zip file and make directory.

install packages
```
npm install
```
if you haven't installed truffle, 
```
npm install -g truffle
```
* if you have an error from npm install, try `yarn install` instead

## Deployment

In this project using private_key from wallet. 

make `.env` file for that.

```
truffle migrate --network ganache <= (whatever you want the network)
```
if you want to use ganache network, try below steps
```
npm install -g ganache-cli

ganache-cli
```

## test coverage 
```
truffle run coverage
```

test your *.sol except migration.sol

