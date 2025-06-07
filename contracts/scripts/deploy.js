const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    try {
        const [deployer] = await ethers.getSigners();
        const deployerAddress = await deployer.getAddress();
        console.log("Deploying contracts with the account:", deployerAddress);

        // Deploy BITSToken
        const BITSToken = await ethers.getContractFactory("BITS");
        const bitsToken = await BITSToken.deploy(deployerAddress);
        await bitsToken.waitForDeployment();
        const bitsTokenAddress = await bitsToken.getAddress();
        console.log("BITSToken deployed to:", bitsTokenAddress);

 

        console.log("\n--- All contracts deployed successfully ---");
        console.log("BITSToken:", bitsTokenAddress);
        console.log("----------------------------------------");

    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
