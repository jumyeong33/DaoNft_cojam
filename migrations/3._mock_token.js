const MockToken = artifacts.require("MockToken");

module.exports = function (deployer) {
  deployer
    .deploy(MockToken)
    .then(() => {
      if (MockToken._json) {
        console.log("Mock Token contract successfully deployed");
      }
    })
    .catch((err) => console.error(err));
};
