/* eslint-disable no-undef */
const { expect, assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
var Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");

const DaoNFT = artifacts.require("DaoNFT.sol");
const MintDAO = artifacts.require("MintDAO.sol");
const MockToken = artifacts.require("MockToken.sol");

function toWei(num) {
  return web3.utils.toWei(num, "ether");
}

function toNum(bn) {
  return Number(web3.utils.fromWei(bn, "ether"));
}

async function getBal(address) {
  return await web3.eth.getBalance(address);
}
/* 
    uint256 public costTier1 = 100 ether;
    uint256 public costTier2 = 200 ether;
    uint256 public costTier3 = 300 ether;

    uint256 public maxSupply = 20;
    uint256 public maxMintAmount = 5;
*/
contract("MintDAO", (accounts) => {
  let nft;
  let minting;
  let ctToken;
  const [owner, user1, user2, user3, user4] = accounts;
  const TOKEN_BALANCE = 10000 * 10 ** 18;

  beforeEach(async () => {
    nft = await DaoNFT.new("WOD MON TEST", "WMT");
    ctToken = await MockToken.new();
    minting = await MintDAO.new(ctToken.address, nft.address);

    await nft.setMintingContract(minting.address);

    await ctToken.mint(user1, toWei("1000"));
    await ctToken.mint(user2, toWei("1000"));
    await ctToken.mint(user3, toWei("1500"));
    await ctToken.mint(user4, toWei("200"));

    await ctToken.approve(minting.address, toWei("1000"), { from: user1 });
    await ctToken.approve(minting.address, toWei("1000"), { from: user2 });
    await ctToken.approve(minting.address, toWei("1500"), { from: user3 });
    await ctToken.approve(minting.address, toWei("1000"), { from: user4 });
  });

  describe("deployed", () => {
    it("should set minting contract address as deployed contract address", async () => {
      assert.equal(await nft.mintingContract(), minting.address);
    });

    it("should get init token balance when contract is deployed", async () => {
      assert.equal(await ctToken.balanceOf(owner), TOKEN_BALANCE);
    });
  });

  describe("Mint", () => {
    describe("Happy Pass with minting 1 NFT", async () => {
      beforeEach(async () => {
        await minting.mint(user1, 1, { from: user1 });
      });

      it("should create a nft", async () => {
        assert.equal(await nft.totalSupply(), 6);
      });

      it("should transfer nft to correct owner", async () => {
        assert.equal(await nft.ownerOf(6), user1);
      });

      it("should transfer ct to correct contract", async () => {
        const bal = await ctToken.balanceOf(minting.address);
        assert.equal(toNum(bal), 100);
      });
    });
    //n times minting. test below testing is 2
    describe("Happy Pass minting n NFTs", () => {
      beforeEach(async () => {
        await minting.mint(user1, 2, { from: user1 });
      });
      it("should create 2 nfts", async () => {
        assert.equal(await nft.totalSupply(), 7);
      });

      it("should transfer nfts to correct owner", async () => {
        const nfts = await nft.walletOfOwner(user1);

        assert.equal(await nft.ownerOf(6), user1);
        assert.equal(await nft.ownerOf(7), user1);
        assert.equal(nfts[0].words[0], 6);
        assert.equal(nfts[1].words[0], 7);
      });
      it("should transfer ct to correct contract", async () => {
        const bal = await ctToken.balanceOf(minting.address);
        assert.equal(toNum(bal), 200);
      });
    });
    //for testing, next cost minting number is 11
    describe("Happy Pass minting with next cost", () => {
      beforeEach(async () => {
        await minting.mint(user1, 5, { from: user1 });
        const bal = await ctToken.balanceOf(minting.address);

        assert.equal(toNum(bal), 500);
      });
      it("should mint with next cost", async () => {
        await minting.mint(user2, 1, { from: user2 });
        const bal = await ctToken.balanceOf(user2);

        assert.equal(toNum(bal), 800);
      });
    });
    //for testing, maxSupply = 19
    describe("Require Pass", () => {
      describe("_mintAmount", () => {
        it("should be more than 0", async () => {
          return await expect(
            minting.mint(user1, 0, { from: user1 })
          ).to.be.rejectedWith("Cannot mint 0 tokens");
        });

        it("should be less than 5", async () => {
          return await expect(
            minting.mint(user1, 6, { from: user1 })
          ).to.be.rejectedWith("Cannot exceed the maximun mint amount");
        });

        it("should be less than max supply amount", async () => {
          await minting.mint(user2, 5, { from: user2 });
          await minting.mint(user3, 5, { from: user3 });

          return await expect(
            minting.mint(user1, 5, { from: user1 })
          ).to.be.rejectedWith("Cannot exceed the maximum token supply");
        });

        it("should be less than max amount per person", async () => {
          await minting.mint(user1, 3, { from: user1 });

          return await expect(
            minting.mint(user1, 3, { from: user1 })
          ).to.be.rejectedWith("Cannot exceed the maximum per-person limit");
        });
      });
      describe("ct token balance", () => {
        describe("previous cost", () => {
          it("buyer should have enough token to mint", async () => {
            return await expect(
              minting.mint(user4, 3, { from: user4 })
            ).to.be.rejectedWith("ERC20: transfer amount exceeds balance");
          });
        });

        describe("next cost", () => {
          it("buyer should have enough token to mint", async () => {
            await minting.mint(user2, 5, { from: user2 });
            return await expect(
              minting.mint(user4, 2, { from: user4 })
            ).to.be.rejectedWith("ERC20: transfer amount exceeds balance");
          });
        });
      });
    });
  });

  describe("withdrawCT", () => {
    describe("Happy Pass", () => {
      beforeEach(async () => {
        await ctToken.approve(minting.address, toWei("500"), { from: user1 });
        await minting.mint(user1, 5, { from: user1 });
      });
      it("should withdraw to owner", async () => {
        const ownerBalBefore = toNum(await ctToken.balanceOf(owner));
        const contractBalBefore = toNum(
          await ctToken.balanceOf(minting.address)
        );
        await minting.withdraw();
        const contractBalAfter = toNum(
          await ctToken.balanceOf(minting.address)
        );
        const ownerBalAfter = toNum(await ctToken.balanceOf(owner));

        assert.equal(contractBalBefore, 500);
        assert.equal(contractBalAfter, 0);
        assert.equal(ownerBalAfter - ownerBalBefore, 500);
      });
    });

    describe("reject withdraw", () => {
      it("caller is not owner", async () => {
        return await expect(
          minting.withdraw({ from: user1 })
        ).to.be.rejectedWith("Ownable: caller is not the owner");
      });
    });
  });
});
