const hre = require("hardhat");

async function main() {
  const MyToken = await hre.ethers.getContractFactory("OneForAll");
  const token = await MyToken.deploy(100000000000); // Deploy and wait

  console.log(`✅ Token deployed to: ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});