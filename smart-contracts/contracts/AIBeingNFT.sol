// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIBeingNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct AIBeing {
        string name;
        uint256 creativity;
        uint256 socialness;
        uint256 riskTaking;
        uint256 ambition;
        uint256 empathy;
        uint256 wallet;
        uint256 reputation;
        uint256 birthTime;
        string economicStyle;
        bool isActive;
        uint256 totalEarnings;
        uint256 collaborations;
    }

    mapping(uint256 => AIBeing) public aiBeings;
    mapping(address => uint256[]) public userBeings;
    
    event AIBeingMinted(
        uint256 indexed tokenId, 
        address indexed owner, 
        string name,
        string economicStyle
    );

    constructor() ERC721("HyperBeings", "HBEING") Ownable(msg.sender) {}

    function mintAIBeing(
        address to,
        string memory name,
        uint256 creativity,
        uint256 socialness,
        uint256 riskTaking,
        uint256 ambition,
        uint256 empathy,
        string memory economicStyle,
        string memory uri
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        ++_tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        aiBeings[tokenId] = AIBeing({
            name: name,
            creativity: creativity,
            socialness: socialness,
            riskTaking: riskTaking,
            ambition: ambition,
            empathy: empathy,
            wallet: 100,
            reputation: 50,
            birthTime: block.timestamp,
            economicStyle: economicStyle,
            isActive: true,
            totalEarnings: 0,
            collaborations: 0
        });

        userBeings[to].push(tokenId);

        emit AIBeingMinted(tokenId, to, name, economicStyle);
        return tokenId;
    }

    function getAIBeing(uint256 tokenId) external view returns (AIBeing memory) {
        require(_ownerOf(tokenId) != address(0), "AI Being does not exist");
        return aiBeings[tokenId];
    }

    function getUserBeings(address user) external view returns (uint256[] memory) {
        return userBeings[user];
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
