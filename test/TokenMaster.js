const { expect } = require("chai") // chai is the frame work reqired for testing the dapp
const { ethers } = require("hardhat")


// setting up details for testing

// details about the contract
const NAME = "TokenMaster";
const SYMBOL = "TM";

// details about event
const OCCASION_NAME = "ETH GZB"
const OCCASION_COST = ethers.utils.parseUnits('1', 'ether')
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "Sept 25"
const OCCASION_TIME = "10:00AM IST"
const OCCASION_LOCATION = "Ghaziabad, UP"


// tests
describe("TokenMaster", () => {

	let tokenMaster;
	let deployer, buyer;

	// runs before each describe block, deploys the contract and sets the accounts
	beforeEach(async () => {
		// setting up the test accounts	
		[deployer, buyer] = await ethers.getSigners();

		// deploying the contract
		const TokenMaster = await ethers.getContractFactory("TokenMaster")
		tokenMaster = await TokenMaster.deploy(NAME, SYMBOL); // invoking the constructor

		//listing an event
		// we need to use the '.connect()' function because with this function we are making a transaction
		// on the blockchain and we need to specify what are account we are using to make that transaction 
		const transaction = await tokenMaster.connect(deployer).list(
			OCCASION_NAME,
			OCCASION_COST,
			OCCASION_MAX_TICKETS,
			OCCASION_DATE,
			OCCASION_TIME,
			OCCASION_LOCATION
		)

		await transaction.wait(); // waiting for all of the transactions to be completed

	})

	// to check the deployment of the contract
	describe("Deployment", () => {
		it("Sets the name", async () => {
			expect(await tokenMaster.name()).to.equal(NAME)
		})

		it("Sets the symbol", async () => {
			expect(await tokenMaster.symbol()).to.equal(SYMBOL);
		})

		it("Sets the owner", async () => {
			expect(await tokenMaster.owner()).to.equal(deployer.address);
		})
	})

	// to check listing of events
	describe("Occasions", () => {
		it("Updates the totalOccasions count", async () => {
			const totalOccasions = await tokenMaster.totalOccasions();
			expect(totalOccasions).to.be.equal(1);
		})

		it("Sets the Occasion Attributes", async () => {
			const occasion = await tokenMaster.getOccasion(1);
			expect(occasion.name).to.equal(OCCASION_NAME);
			expect(occasion.cost).to.equal(OCCASION_COST);
			expect(occasion.maxTickets).to.equal(OCCASION_MAX_TICKETS);
			expect(occasion.date).to.equal(OCCASION_DATE);
			expect(occasion.time).to.equal(OCCASION_TIME);
			expect(occasion.location).to.equal(OCCASION_LOCATION);
		})
	})

	// to check the minting of NFTs (buying of seats)
	describe("Minting", () => {
		const ID = 1;
		const SEAT = 23;
		const AMOUNT = ethers.utils.parseUnits('1', 'ether')

		beforeEach(async () => {
			const transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
			await transaction.wait();
		})

		it("Updates the totalSupply", async () => {
			expect(await tokenMaster.totalSupply()).to.be.equal(1);
		})

		it("Updates the ticket count", async () => {
			const occasion = await tokenMaster.getOccasion(1);
			expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1)
		})

		it("Updates the buying status", async () => {
			expect(await tokenMaster.hasBought(ID, buyer.address)).to.equal(true);
		})

		it("Updates the seat status", async () => {
			expect(await tokenMaster.seatTaken(ID, SEAT)).to.equal(buyer.address);
		})

		it("Updates the overall seating status", async () => {
			const seats = await tokenMaster.getSeatsTaken(ID)
			expect(seats.length).to.be.equal(1);
			expect(seats[0]).to.be.equal(SEAT);
		})

		it("Update the contract balace", async () => {
			const balance = await ethers.provider.getBalance(tokenMaster.address)
			expect(balance).to.be.equal(AMOUNT);
		})

	})

	describe("Withdrawing", () => {

		const ID = 1;
		const SEAT = 23;
		const AMOUNT = ethers.utils.parseUnits('1', 'ether')
		let balanceBefore;

		beforeEach(async () => {
			balanceBefore = await ethers.provider.getBalance(deployer.address)

			let transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
			await transaction.wait();

			transaction = await tokenMaster.connect(deployer).withdraw();
			await transaction.wait();
		})

		it("Updates the owner balance", async () => {
			const balanceAfter = await ethers.provider.getBalance(deployer.address)
			expect(balanceAfter).to.be.greaterThan(balanceBefore);
		})

		it("Updates the contract balance", async () => {
			const balance = await ethers.provider.getBalance(tokenMaster.address)
			expect(balance).to.be.equal(0)
		})
	})


})
