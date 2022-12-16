const { expect, assert } = require("chai");

const DaoNFT = artifacts.require("DaoNFT.sol");

require("chai").use(require("chai-as-promised")).should();

contract("DaoNFT", (accounts) => {
  let nft;
  const [owner, user1, user2, user3] = accounts;

  beforeEach(async () => {
    nft = await DaoNFT.new("WOD MON TEST", "WMT");
  });

  describe("deployed", () => {
    it("deployed propery", async () => {
      const name = await nft.name();
      const symbol = await nft.symbol();

      assert.equal(name, "WOD MON TEST");
      assert.equal(symbol, "WMT");
    });

    it("deployed with 5 nfts", async () => {
      const total = await nft.totalSupply();

      assert.equal(total, 5);
    });

    it("deployed with right owner", async () => {
      const deployedOwner = await nft.owner();

      assert.equal(deployedOwner, owner);
    });
  });
  describe("Mint", () => {
    beforeEach(async () => {
      await nft.safeMint(user1);
    });

    it("should mint a token as tokenID 6", async () => {
      const mintedAddress = await nft.ownerOf(6);

      assert.equal(mintedAddress, user1);
    });

    it("should increase the total supply", async () => {
      const total = await nft.totalSupply();

      assert.equal(total, 6);
    });

    it("should next mint tokenID +1", async () => {
      await nft.safeMint(user1);
      const ownerOfTokenId7 = await nft.ownerOf(7);
      assert.equal(ownerOfTokenId7, user1);
    });

    it("only owner can mint", async () => {
      return await expect(
        nft.safeMint(user2, { from: user1 })
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });
  });

  describe("Get TokenURI", () => {
    it("should return correct TokenURI", async () => {
      const uri = await nft.tokenURI(5);

      assert.equal(
        uri,
        "https://gateway.pinata.cloud/ipfs/QmTbFxK5Yo1NTo4nTJtQZLx3DoU4zLjkmTsm48AubBLi3J/5.json"
      );
    });
  });

  describe("Get NFTs", () => {
    it("should return all nft by address", async () => {
      let id = 1;
      const nfts = await nft.walletOfOwner(owner);

      assert.equal(nfts.length, 5);
      for (const nft of nfts) {
        assert.equal(nft.words[0], id);
        id = id + 1;
      }
    });
  });
});
