const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

// this code only contains the inital conditions the application will have when it goes live
// hence it does not have all the functions such as withdraw

async function main() {
  // Setting up the owner to deploy the contract on the blockchain
  // and the Contract name and Symbol

  const NAME = "TokenMaster"
  const SYMBOL = "TM"

  const [deployer] = await ethers.getSigners() // for deploying on hardhat testchain
  // const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_API_URL);
  // const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


  console.log("Deploying contract with account:", deployer.address);

  // Deploying the contract
  const TokenMaster = await ethers.getContractFactory("TokenMaster")
  const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL)
  await tokenMaster.deployed()

  console.log(`Deployed TokenMaster Contract at: ${tokenMaster.address}\n`)

  // Listing events
  // array of all the occasions
  const occasions = [
    {
      name: "SunBurn Goa 2024",
      cost: tokens(0.03),
      tickets: 0,
      date: "Dec 28",
      time: "2:00PM IST",
      location: "Goa"
    },
    {
      name: "ETH Delhi",
      cost: tokens(0.01),
      tickets: 125,
      date: "Oct 2",
      time: "11:00AM IST",
      location: "New Delhi"
    },
    {
      name: "DevFolio Hackathon",
      cost: tokens(0.025),
      tickets: 200,
      date: "Sept 29",
      time: "11:00AM IST",
      location: "Dharamshala, Himachal Pradesh"
    },
    {
      name: "India Vs New Zealand, 1st Test",
      cost: tokens(0.05),
      tickets: 0,
      date: "Oct 16",
      time: "11:00AM IST",
      location: "M Chinnaswamy Stadium, Bangaluru"
    },
    {
      name: "50 Cent concert",
      cost: tokens(0.015),
      tickets: 125,
      date: "Nov 24",
      time: "6:00PM IST",
      location: "Mumbai, MP"
    }
  ]

  // listing the occasions one by one on the contract 
  for (var i = 0; i < 5; i++) {
    const transaction = await tokenMaster.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].tickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`)
  }
}


// all the code for the deployment is written in the main function
// the main function is called below with a catch block
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});