const DaoNFT = artifacts.require("DaoNFT");
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(DaoNFT, "COJAM DAO TEST", "CDT").then(() => {
    if (DaoNFT._json) {
      fs.writeFile(
        "deployedABI_DaoNFT",
        JSON.stringify(DaoNFT._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress_DaoNFT", DaoNFT.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
