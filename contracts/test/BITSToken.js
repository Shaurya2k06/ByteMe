const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("BITS Contract", function () {
    async function deployBITSTokenFixture() {
        const [owner, addr1, addr2] = await ethers.getSigners();
        const BITSTokenFactory = await ethers.getContractFactory("BITS");
        const BITSToken = await BITSTokenFactory.deploy(owner.address);
        await BITSToken.waitForDeployment();
        const BITSTokenAddress = await BITSToken.getAddress();
        return { BITSToken, BITSTokenAddress, owner, addr1, addr2 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { BITSToken, owner } = await loadFixture(deployBITSTokenFixture);
            expect(await BITSToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const { BITSToken, owner } = await loadFixture(deployBITSTokenFixture);
            const ownerBalance = await BITSToken.balanceOf(owner.address);
            const expectedSupply = ethers.parseUnits("1000000000", 18); // 1 billion tokens with 18 decimals
            expect(await BITSToken.totalSupply()).to.equal(expectedSupply);
            expect(ownerBalance).to.equal(expectedSupply);
        });

        it("Should have correct name and symbol", async function () {
            const { BITSToken } = await loadFixture(deployBITSTokenFixture);
            expect(await BITSToken.name()).to.equal("BITSToken");
            expect(await BITSToken.symbol()).to.equal("BITS");
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const { BITSToken, owner, addr1, addr2 } = await loadFixture(deployBITSTokenFixture);
            const amount = ethers.parseUnits("100", 18);

            // Transfer 100 tokens from owner to addr1
            await expect(BITSToken.transfer(addr1.address, amount))
                .to.emit(BITSToken, "Transfer")
                .withArgs(owner.address, addr1.address, amount);
            expect(await BITSToken.balanceOf(addr1.address)).to.equal(amount);

            // Transfer 50 tokens from addr1 to addr2
            await expect(BITSToken.connect(addr1).transfer(addr2.address, ethers.parseUnits("50", 18)))
                .to.emit(BITSToken, "Transfer")
                .withArgs(addr1.address, addr2.address, ethers.parseUnits("50", 18));
            expect(await BITSToken.balanceOf(addr2.address)).to.equal(ethers.parseUnits("50", 18));
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            const initialOwnerBalance = await BITSToken.balanceOf(owner.address);
            const amount = ethers.parseUnits("1", 18);

            await expect(
                BITSToken.connect(addr1).transfer(owner.address, amount) // addr1 has 0 tokens
            ).to.be.revertedWithCustomError(BITSToken, "ERC20InsufficientBalance");

            expect(await BITSToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });
    });

    describe("Minting", function () {
        it("Should allow owner to mint tokens", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            const amount = ethers.parseUnits("500", 18);
            const initialTotalSupply = await BITSToken.totalSupply();

            await expect(BITSToken.mint(addr1.address, amount))
                .to.emit(BITSToken, "Transfer")
                .withArgs(ethers.ZeroAddress, addr1.address, amount);

            expect(await BITSToken.balanceOf(addr1.address)).to.equal(amount);
            expect(await BITSToken.totalSupply()).to.equal(initialTotalSupply + amount);
        });

        it("Should not allow non-owner to mint tokens", async function () {
            const { BITSToken, addr1, addr2 } = await loadFixture(deployBITSTokenFixture);
            const amount = ethers.parseUnits("100", 18);
            await expect(
                BITSToken.connect(addr1).mint(addr2.address, amount)
            ).to.be.revertedWithCustomError(BITSToken, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
        });
    });

    describe("Burning", function () {
        it("Should allow users to burn their tokens", async function () {
            const { BITSToken, owner } = await loadFixture(deployBITSTokenFixture);
            const burnAmount = ethers.parseUnits("100", 18);
            const initialOwnerBalance = await BITSToken.balanceOf(owner.address);
            const initialTotalSupply = await BITSToken.totalSupply();

            await expect(BITSToken.burn(burnAmount))
                .to.emit(BITSToken, "Transfer")
                .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

            expect(await BITSToken.balanceOf(owner.address)).to.equal(initialOwnerBalance - burnAmount);
            expect(await BITSToken.totalSupply()).to.equal(initialTotalSupply - burnAmount);
        });

        it("Should not allow burning more tokens than balance", async function () {
            const { BITSToken, addr1 } = await loadFixture(deployBITSTokenFixture);
            const burnAmount = ethers.parseUnits("100", 18);
            await expect(
                BITSToken.connect(addr1).burn(burnAmount) // addr1 has 0 tokens
            ).to.be.revertedWithCustomError(BITSToken, "ERC20InsufficientBalance");
        });

        it("Should allow approved address to burnFrom", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            const transferAmount = ethers.parseUnits("200", 18);
            const burnAmount = ethers.parseUnits("100", 18);
            await BITSToken.transfer(addr1.address, transferAmount); // Give addr1 some tokens

            const initialAddr1Balance = await BITSToken.balanceOf(addr1.address);
            const initialTotalSupply = await BITSToken.totalSupply();

            await BITSToken.connect(addr1).approve(owner.address, burnAmount); // addr1 approves owner to spend
            await expect(BITSToken.connect(owner).burnFrom(addr1.address, burnAmount))
                .to.emit(BITSToken, "Transfer")
                .withArgs(addr1.address, ethers.ZeroAddress, burnAmount);

            expect(await BITSToken.balanceOf(addr1.address)).to.equal(initialAddr1Balance - burnAmount);
            expect(await BITSToken.totalSupply()).to.equal(initialTotalSupply - burnAmount);
        });

        it("Should not allow burnFrom without allowance", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            const transferAmount = ethers.parseUnits("100", 18);
            await BITSToken.transfer(addr1.address, transferAmount);
            const burnAmount = ethers.parseUnits("50", 18);

            await expect(
                BITSToken.connect(owner).burnFrom(addr1.address, burnAmount)
            ).to.be.revertedWithCustomError(BITSToken, "ERC20InsufficientAllowance");
        });
    });

    describe("Withdraw Stuck Tokens", function () {
        it("Should allow owner to withdraw stuck BITSTokens", async function () {
            const { BITSToken, BITSTokenAddress, owner } = await loadFixture(deployBITSTokenFixture);
            const stuckAmount = ethers.parseUnits("100", 18);
            await BITSToken.transfer(BITSTokenAddress, stuckAmount); // Send tokens to the contract itself

            expect(await BITSToken.balanceOf(BITSTokenAddress)).to.equal(stuckAmount);
            const ownerInitialBalance = await BITSToken.balanceOf(owner.address);

            await expect(BITSToken.withdrawStuckBITS())
                .to.emit(BITSToken, "Transfer")
                .withArgs(BITSTokenAddress, owner.address, stuckAmount);

            expect(await BITSToken.balanceOf(BITSTokenAddress)).to.equal(0);
            expect(await BITSToken.balanceOf(owner.address)).to.equal(ownerInitialBalance + stuckAmount);
        });

        it("Should not allow non-owner to withdraw stuck BITSTokens", async function () {
            const { BITSToken, BITSTokenAddress, addr1 } = await loadFixture(deployBITSTokenFixture);
            const stuckAmount = ethers.parseUnits("100", 18);
            await BITSToken.transfer(BITSTokenAddress, stuckAmount);

            await expect(
                BITSToken.connect(addr1).withdrawStuckBITS()
            ).to.be.revertedWithCustomError(BITSToken, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
        });

        it("Should allow owner to withdraw other stuck ERC20 tokens", async function () {
            const { BITSToken, BITSTokenAddress, owner, addr1 } = await loadFixture(deployBITSTokenFixture);

            // Deploy a dummy ERC20 token
            const DummyERC20 = await ethers.getContractFactory("BITS"); // Using BITS as a generic ERC20
            const dummyToken = await DummyERC20.deploy(owner.address);
            await dummyToken.waitForDeployment();
            const dummyTokenAddress = await dummyToken.getAddress();

            const stuckAmount = ethers.parseUnits("50", 18);
            await dummyToken.transfer(BITSTokenAddress, stuckAmount); // Send dummy tokens to BITS contract

            expect(await dummyToken.balanceOf(BITSTokenAddress)).to.equal(stuckAmount);
            const ownerInitialDummyBalance = await dummyToken.balanceOf(owner.address);

            await expect(BITSToken.withdrawStuckERC20(dummyTokenAddress))
                .to.emit(dummyToken, "Transfer") // Event from dummyToken
                .withArgs(BITSTokenAddress, owner.address, stuckAmount);

            expect(await dummyToken.balanceOf(BITSTokenAddress)).to.equal(0);
            expect(await dummyToken.balanceOf(owner.address)).to.equal(ownerInitialDummyBalance + stuckAmount);
        });
    });

    describe("Autopay Functionality", function () {
        it("Should authorize owner as collector on deployment", async function () {
            const { BITSToken, owner } = await loadFixture(deployBITSTokenFixture);
            expect(await BITSToken.authorizedCollectors(owner.address)).to.be.true;
        });

        it("Should allow owner to authorize new collectors", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            
            await expect(BITSToken.authorizeCollector(addr1.address))
                .to.emit(BITSToken, "CollectorAuthorized")
                .withArgs(addr1.address);
            
            expect(await BITSToken.authorizedCollectors(addr1.address)).to.be.true;
        });

        it("Should allow users to enable autopay for authorized collectors", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            
            // First give addr1 some tokens
            await BITSToken.transfer(addr1.address, ethers.parseUnits("1000", 18));
            
            const amount = ethers.parseUnits("100", 18);
            const interval = 30 * 24 * 60 * 60; // 30 days
            
            await expect(BITSToken.connect(addr1).enableAutopay(owner.address, amount, interval))
                .to.emit(BITSToken, "AutopayEnabled")
                .withArgs(addr1.address, owner.address, amount, interval);
            
            const subscription = await BITSToken.getAutopaySubscription(addr1.address, owner.address);
            expect(subscription.isActive).to.be.true;
            expect(subscription.amount).to.equal(amount);
        });

        it("Should not allow autopay for unauthorized collectors", async function () {
            const { BITSToken, addr1, addr2 } = await loadFixture(deployBITSTokenFixture);
            
            const amount = ethers.parseUnits("100", 18);
            const interval = 30 * 24 * 60 * 60;
            
            await expect(
                BITSToken.connect(addr1).enableAutopay(addr2.address, amount, interval)
            ).to.be.revertedWith("BITS: Collector not authorized");
        });

        it("Should execute autopay when due", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            
            // Give addr1 tokens and set up autopay
            await BITSToken.transfer(addr1.address, ethers.parseUnits("1000", 18));
            
            const amount = ethers.parseUnits("100", 18);
            const interval = 30 * 24 * 60 * 60; // 30 days
            
            await BITSToken.connect(addr1).enableAutopay(owner.address, amount, interval);
            
            // Fast forward time to make payment due
            await time.increase(interval + 1);
            
            const initialOwnerBalance = await BITSToken.balanceOf(owner.address);
            const initialAddr1Balance = await BITSToken.balanceOf(addr1.address);
            
            await expect(BITSToken.executeAutopay(addr1.address, owner.address))
                .to.emit(BITSToken, "AutopayExecuted")
                .withArgs(addr1.address, owner.address, amount);
            
            expect(await BITSToken.balanceOf(owner.address)).to.equal(initialOwnerBalance + amount);
            expect(await BITSToken.balanceOf(addr1.address)).to.equal(initialAddr1Balance - amount);
        });

        it("Should not execute autopay if not due", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            
            await BITSToken.transfer(addr1.address, ethers.parseUnits("1000", 18));
            
            const amount = ethers.parseUnits("100", 18);
            const interval = 30 * 24 * 60 * 60;
            
            await BITSToken.connect(addr1).enableAutopay(owner.address, amount, interval);
            
            await expect(
                BITSToken.executeAutopay(addr1.address, owner.address)
            ).to.be.revertedWith("BITS: Autopay not due yet");
        });

        it("Should allow users to disable autopay", async function () {
            const { BITSToken, owner, addr1 } = await loadFixture(deployBITSTokenFixture);
            
            await BITSToken.transfer(addr1.address, ethers.parseUnits("1000", 18));
            
            const amount = ethers.parseUnits("100", 18);
            const interval = 30 * 24 * 60 * 60;
            
            await BITSToken.connect(addr1).enableAutopay(owner.address, amount, interval);
            
            await expect(BITSToken.connect(addr1).disableAutopay(owner.address))
                .to.emit(BITSToken, "AutopayDisabled")
                .withArgs(addr1.address, owner.address);
            
            const subscription = await BITSToken.getAutopaySubscription(addr1.address, owner.address);
            expect(subscription.isActive).to.be.false;
        });
    });
});