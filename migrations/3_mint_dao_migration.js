const DaoNFT = artifacts.require("DaoNFT");
const MintDAO = artifacts.require("MintDAO");
const fs = require("fs");

module.exports = function (deployer) {
  deployer.deploy(MintDAO, "0x1bb455181509175dB86E54135a9952522DD88432", DaoNFT.address).then(() => {
    if (MintDAO._json) {
      fs.writeFile(
        "deployedABI_MintDAO",
        JSON.stringify(MintDAO._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress_MintDAO", MintDAO.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
