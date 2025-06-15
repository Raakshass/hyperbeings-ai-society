const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting HyperBeings NFT deployment to Hyperion testnet...");
  console.log("📍 Network:", hre.network.name);

  // Get the contract factory
  const AIBeingNFT = await hre.ethers.getContractFactory("AIBeingNFT");
  
  console.log("📄 Deploying AIBeingNFT contract...");
  
  // Deploy the contract
  const aiBeingNFT = await AIBeingNFT.deploy();
  
  // Wait for deployment
  await aiBeingNFT.waitForDeployment();
  
  const contractAddress = await aiBeingNFT.getAddress();
  
  console.log("✅ AIBeingNFT deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  console.log("🔍 Hyperion Explorer:", `https://hyperion-testnet-explorer.metisdevops.link/address/${contractAddress}`);
  
  // Verify deployment by calling view functions
  try {
    const name = await aiBeingNFT.name();
    const symbol = await aiBeingNFT.symbol();
    const totalSupply = await aiBeingNFT.totalSupply();
    
    console.log("\n🎭 Contract Details:");
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Total Supply:", totalSupply.toString());
  } catch (error) {
    console.log("⚠️ Could not verify contract details:", error.message);
  }
  
  console.log("\n📋 Deployment Summary:");
  console.log("======================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: Hyperion Testnet`);
  console.log(`Chain ID: 133717`);
  console.log(`Deployer: ${(await hre.ethers.getSigners())[0].address}`);
  console.log(`Explorer: https://hyperion-testnet-explorer.metisdevops.link/address/${contractAddress}`);
  
  console.log("\n🔧 Next Steps:");
  console.log("1. Update CONTRACT_ADDRESS in Web3Provider.tsx");
  console.log("2. Test minting functionality");
  console.log("3. Submit to HyperHack hackathon!");
  
  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
