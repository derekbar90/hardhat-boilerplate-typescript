
# Random Project 🧙‍♂️

## Project Structure
- .github
	- CICD
- artifacts
	- hardhat compile artifacts (abis
- contracts
	- protocol contracts
- deploy
	- deployment files for the different contracts of the protocol
- deployments
	- the deployed artifacts, same as artifacts but has the deployed address and other goodies per chain
- patches
	- node_module patches we need to properly compile on ^0.8.10
- test
	- Unit test files for the contracts
- types
	- these are auto generated by typechain plugin within hardhat.config.ts, we use these a lot in tests and deployment files. These are created during compile of the contracts
- utils
	- helpful scripts to manage constants or parsing events from transactions, also mocha setup for waffle chai matchers (https://ethereum-waffle.readthedocs.io/en/latest/matchers.html)