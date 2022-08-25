// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITrait {
    enum ELEMENT_TYPES { WATER, WIND, LIGHTNING, ICE, PLANT, EARTH, FIRE }

    struct Trait {
        ELEMENT_TYPES element;
        uint256 power;
    }
}

interface IShibamentNFT is ITrait {
    function getTraitByID(uint256) external view returns(Trait memory);
    function ownerOf(uint256) external returns(address);
    function totalSupply() external returns(uint256);
}

contract BattleField is VRFConsumerBase, ITrait, Ownable {

    bytes32 internal keyHash;
    uint256 internal fee;

    struct Character {
        STATES state;
        ELEMENT_TYPES element;
        uint256 power;
        uint256 random;
        address owner;
        uint256 enemyID;
        uint256 enterPrice;
    }
    uint256 public POWER_BONUS = 10;
    mapping(bytes32 => uint256) randomRequest;
    mapping(uint256 => Character) public characters;
    mapping(address => uint256) public rewards;
    mapping(ELEMENT_TYPES => mapping(ELEMENT_TYPES => bool)) flow;
    IShibamentNFT shibament;
    IERC20 shibatoken;

    enum STATES { NOTENTERED, ENTERED, PICKED }
    event EnteredBattle(address indexed _from, uint256 indexed _id);
    event StartedEnemyChoose(address indexed _from, uint256 indexed _id);
    event EnemySelected(address indexed _from, uint256 indexed _id, uint256 indexed _eid);
    event BattleStarted(address indexed _from, uint256 indexed _id, uint256 indexed _eid);
    event BattleEnded(address indexed _from, uint256 indexed _id, uint256 indexed _eid, bool result);

    constructor(address shibaAddress, address tokenAddress)
        VRFConsumerBase(
            0xa555fC018435bef5A13C6c6870a9d4C11DEC329C, // VRF Coordinator
            0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06  // LINK Token
        )
    {
        keyHash = 0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)

        flow[ELEMENT_TYPES.WATER][ELEMENT_TYPES.FIRE] = true; flow[ELEMENT_TYPES.WATER][ELEMENT_TYPES.EARTH] = true;
        flow[ELEMENT_TYPES.WIND][ELEMENT_TYPES.EARTH] = true; flow[ELEMENT_TYPES.WIND][ELEMENT_TYPES.PLANT] = true;
        flow[ELEMENT_TYPES.LIGHTNING][ELEMENT_TYPES.WIND] = true; flow[ELEMENT_TYPES.LIGHTNING][ELEMENT_TYPES.PLANT] = true;
        flow[ELEMENT_TYPES.ICE][ELEMENT_TYPES.LIGHTNING] = true; flow[ELEMENT_TYPES.ICE][ELEMENT_TYPES.WIND] = true;
        flow[ELEMENT_TYPES.PLANT][ELEMENT_TYPES.WATER] = true; flow[ELEMENT_TYPES.PLANT][ELEMENT_TYPES.ICE] = true;
        flow[ELEMENT_TYPES.EARTH][ELEMENT_TYPES.FIRE] = true; flow[ELEMENT_TYPES.EARTH][ELEMENT_TYPES.LIGHTNING] = true;
        flow[ELEMENT_TYPES.FIRE][ELEMENT_TYPES.ICE] = true; flow[ELEMENT_TYPES.FIRE][ELEMENT_TYPES.PLANT] = true;

        shibament = IShibamentNFT(shibaAddress);
        shibatoken = IERC20(tokenAddress);
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 tokenID = randomRequest[requestId];
        if(characters[tokenID].state == STATES.ENTERED) {
            getChosenEnemy(requestId, randomness);
        }
    }

    function enterGame(uint256 tokenID, uint256 amount) external {
        require(shibament.ownerOf(tokenID) == msg.sender, "You are not the owner of this nft");
        require(characters[tokenID].state == STATES.NOTENTERED, "This yukiment is in play mode");
        uint256 balance = shibatoken.balanceOf(msg.sender);
        uint256 maximum = shibatoken.balanceOf(address(this)) / 10;
        require(amount > 0 && amount <= balance, "Insufficient balance");
        require(amount <= maximum, "Insufficient pool balance");
        characters[tokenID].element = shibament.getTraitByID(tokenID).element;
        characters[tokenID].power = shibament.getTraitByID(tokenID).power;
        characters[tokenID].owner = msg.sender;
        characters[tokenID].state = STATES.ENTERED;
        characters[tokenID].enterPrice = amount;
        shibatoken.transferFrom(msg.sender, address(this), amount);
    }

    function startChooseEnemy(uint256 tokenID) external {
        require(shibament.ownerOf(tokenID) == msg.sender, "You are not the owner of this nft");
        require(characters[tokenID].state == STATES.ENTERED, "Player not choosed yet");
        bytes32 reqID = getRandomNumber();
        randomRequest[reqID] = tokenID;
        emit StartedEnemyChoose(msg.sender, tokenID);
    }

    function getChosenEnemy(bytes32 requestId, uint256 random) internal {
        uint256 supply = shibament.totalSupply();
        uint256 index = random % supply;
        uint256 tokenID = randomRequest[requestId];
        characters[tokenID].state = STATES.PICKED;
        characters[tokenID].random = random;
        characters[tokenID].enemyID = index + 1;
        emit EnemySelected(msg.sender, tokenID, characters[tokenID].enemyID);
    }

    function startFight(uint256 tokenID) external {
        require(shibament.ownerOf(tokenID) == msg.sender, "You are not the owner of this nft");
        require(characters[tokenID].state == STATES.PICKED, "Enemy not choosed yet");

        emit BattleStarted(msg.sender, tokenID, characters[tokenID].enemyID);
        uint256 enemyID = characters[tokenID].enemyID;
        characters[enemyID].element = shibament.getTraitByID(enemyID).element;
        characters[enemyID].power = shibament.getTraitByID(enemyID).power;

        uint256 winPercent = calcWinPercent(tokenID);
        uint256 random = (characters[tokenID].random / 1000) % 100;
        if(random >= winPercent) {
            emit BattleEnded(msg.sender, tokenID, characters[tokenID].enemyID, false);
        } else {
            uint256 rewardPercent = (characters[tokenID].random / 100000) % 100;
            rewards[msg.sender] += characters[tokenID].enterPrice * (100 + rewardPercent) / 100;
            emit BattleEnded(msg.sender, tokenID, characters[tokenID].enemyID, true);
        }
        characters[tokenID].state = STATES.NOTENTERED;
    }

    function calcWinPercent(uint256 tokenID) public returns (uint256) {
        uint256 enemyID = characters[tokenID].enemyID;
        uint256 fighterPower = getBattlePower(characters[tokenID].power, characters[tokenID].element, characters[enemyID].element);
        uint256 winPercent = 50 + (fighterPower - characters[enemyID].power) / 10;
        winPercent = winPercent < 0 ? 0 : winPercent;
        return winPercent;
    }

    function claimReward(address _player) external {
        require(rewards[_player] > 0, "No funds to claim");
        shibatoken.transfer(_player, rewards[_player]);
    }

    function getBattlePower(uint256 power, ELEMENT_TYPES element, ELEMENT_TYPES enemyElement) public returns(uint256) {
        if (flow[element][enemyElement] == true)
            return power * (100 + POWER_BONUS) / 100;
        return power;
    }

    function getCurrentState(uint256 tokenID) external view returns(STATES) {
        return characters[tokenID].state;
    }

    function showRandomNumber(uint256 tokenID) external view returns(uint256) {
        return characters[tokenID].random;
    }

    function withdrawPoolFund() external onlyOwner {
        uint256 balance = shibatoken.balanceOf(address(this));
        shibatoken.transfer(msg.sender, balance);
    }

    function setShibamentToken(address _token) external onlyOwner {
        shibatoken = IERC20(_token);
    }

    function setShibaNFT(address _nft) external onlyOwner {
        shibament = IShibamentNFT(_nft);
    }
}