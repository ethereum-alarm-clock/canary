var Migrations = artifacts.require("./Migrations.sol");

/// Canary
const Canary = artifacts.require("./Canary.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations)
  .then(() => {
    return deployer.deploy(Canary)
  })
  .then(() => {
    console.log('success')
  })
};
