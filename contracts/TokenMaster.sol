// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // this line imports the ERC721 Contract from OpenZepplin library

contract TokenMaster is ERC721 {
    address public owner;
    uint256 public totalOccasions; // to keep track number of occasions created
    uint256 public totalSupply; // total number of tickets(NFTs) created

    // Occasion class, defines the event

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    // mapping to store the created occasions on the blockchain, maps from occasion id to the details about the occasion
    //      occasionID => Occasion
    mapping(uint256 => Occasion) occasions;

    // mapping to make sure a seat cant be booked twice
    //     occasionId => (buyer address => true or false)
    mapping(uint256 => mapping(address => bool)) public hasBought;

    // mapping to store what address has bought which seat
    //      occasionId =>  ( seatID  =>  walletAddress )
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;

    // mapping to store the what seats are taken(have been booked) in an occasion
    //      OccasionId => Array of seatID
    mapping(uint256 => uint256[]) seatsTaken;

    // modifiers

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // setting the owner, owner will be the account that deployes the contract
    // All the funds will go to the owner account when a ticket is purchased
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    // function for listing events on the website
    // The event will have a name,date, location, seats available in the event, time and amount of eth required to purchase a ticket for the event
    // when this function is called, the event is created and stored in the mapping
    // only the owner can create events, onlyOwner modfier used
    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    // function for minting NFTs
    // openZepplin already has a mint function with all the required functionality, we just need to _safemint() function to mint the NFT
    // function is payable because creating NFT (Purchasing a ticket) require eth
    // takes occasion id and Seat number as arguement
    // occasion id corresponds to the occasion the person is buying tickets for and same for _seat

    function mint(uint256 _id, uint256 _seat) public payable {
        // Require that _id is not 0 or less than total occasions...
        require(_id != 0);
        require(_id <= totalOccasions);

        // Require that ETH sent is greater than cost...
        require(msg.value >= occasions[_id].cost);

        // Require that the seat is not taken, and the seat exists...
        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= occasions[_id].maxTickets);

        occasions[_id].tickets -= 1; // decreasing the total number of tickets available

        hasBought[_id][msg.sender] = true; // updating the buying status
        seatTaken[_id][_seat] = msg.sender; // assigning a seat to an address

        seatsTaken[_id].push(_seat); // storing what seats are taken and are not available for booking

        totalSupply++; // increasing the total number of NFTs created

        _safeMint(msg.sender, totalSupply); /public/ the function takes the address of the wallet thats minting the NFT and the token ID as arguements, token ID in our case is Ticket Number
    }

    // fetching details about an occasion
    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    // function to withdraw funds from the contract
    // only owner can call this function
    // the sender is msg.sender
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
