// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CommunityBoard {
    struct Post {
        uint256 id;
        address author;
        uint256 matchId;
        string text;
        string pick;
        uint256 upvotes;
        uint256 timestamp;
    }

    uint256 public postCount;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => uint256[]) public matchPosts;

    event PredictionPosted(uint256 indexed postId, address indexed author, uint256 indexed matchId, string pick);
    event Upvoted(uint256 indexed postId, address indexed voter);

    function postPrediction(
        uint256 matchId,
        string calldata text,
        string calldata pick
    ) external returns (uint256 postId) {
        require(bytes(text).length > 0 && bytes(text).length <= 280, "Invalid length");
        postId = ++postCount;
        posts[postId] = Post({
            id: postId,
            author: msg.sender,
            matchId: matchId,
            text: text,
            pick: pick,
            upvotes: 0,
            timestamp: block.timestamp
        });
        matchPosts[matchId].push(postId);
        emit PredictionPosted(postId, msg.sender, matchId, pick);
    }

    function upvote(uint256 postId) external {
        require(posts[postId].id != 0, "Not found");
        require(!hasVoted[postId][msg.sender], "Already voted");
        require(posts[postId].author != msg.sender, "Own post");
        hasVoted[postId][msg.sender] = true;
        posts[postId].upvotes++;
        emit Upvoted(postId, msg.sender);
    }

    function getMatchPosts(uint256 matchId) external view returns (uint256[] memory) {
        return matchPosts[matchId];
    }

    function getPost(uint256 postId) external view returns (Post memory) {
        return posts[postId];
    }
}
