const Helloworld = artifacts.require("Helloworld");
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(Helloworld, "Hello smart contract world").then(() => {
    if (Helloworld._json) {
      fs.writeFile(
        "deployedABI_Helloworld",
        JSON.stringify(Helloworld._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress_Helloworld", Helloworld.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
