const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    try {
        const [deployer] = await ethers.getSigners();
        const deployerAddress = await deployer.getAddress();
        console.log("Deploying BITS Token with autopay functionality...");
        console.log("Deploying contracts with the account:", deployerAddress);
        console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployerAddress)), "ETH");

        // Deploy BITSToken with autopay functionality
        const BITSToken = await ethers.getContractFactory("BITS");
        const bitsToken = await BITSToken.deploy(deployerAddress);
        await bitsToken.waitForDeployment();
        const bitsTokenAddress = await bitsToken.getAddress();
        
        console.log("BITSToken deployed to:", bitsTokenAddress);

        // Verify deployment
        console.log("\n--- Verifying deployment ---");
        const totalSupply = await bitsToken.totalSupply();
        const deployerBalance = await bitsToken.balanceOf(deployerAddress);
        const isAuthorizedCollector = await bitsToken.authorizedCollectors(deployerAddress);

        console.log("Total Supply:", ethers.formatEther(totalSupply), "BITS");
        console.log("Deployer Balance:", ethers.formatEther(deployerBalance), "BITS");
        console.log("Deployer is authorized collector:", isAuthorizedCollector);

        // Authorize admin account if different from deployer
        const ADMIN_ACCOUNT = "0x4f91bd1143168af7268eb08b017ec785c06c0e61";
        if (ADMIN_ACCOUNT.toLowerCase() !== deployerAddress.toLowerCase()) {
            console.log("\nAuthorizing admin account as collector...");
            const authTx = await bitsToken.authorizeCollector(ADMIN_ACCOUNT);
            await authTx.wait();
            console.log("Admin account authorized:", ADMIN_ACCOUNT);
            
            const isAdminAuthorized = await bitsToken.authorizedCollectors(ADMIN_ACCOUNT);
            console.log("Admin authorization confirmed:", isAdminAuthorized);
        }

        console.log("\n--- All contracts deployed successfully ---");
        console.log("BITSToken with Autopay:", bitsTokenAddress);
        console.log("----------------------------------------");
        console.log("\n🔥 UPDATE YOUR FRONTEND:");
        console.log(`const BITS_CONTRACT_ADDRESS = "${bitsTokenAddress}";`);
        console.log("----------------------------------------");

        return bitsTokenAddress;

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
