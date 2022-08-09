// SPDX-License-Identifier: GPX
pragma solidity ^0.5.6;

contract NFTSimple {
    string public name = "KlayLion";
    string public symbol = "KL"; // 화폐 단위

    mapping (uint256 => address) public tokenOwner;
    mapping (uint256 => string) public tokenURIs;
    mapping (address => uint256[]) private _ownedTokens;
    // onKIP17Received bytes value
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;

    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public returns (bool) {
        tokenOwner[tokenId] = to;
        tokenURIs[tokenId] = tokenURI;
        _ownedTokens[to].push(tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {
        require(from == msg.sender, "from != msg.sender"); // 토큰의 소유자만 전송할 권리가 있음. 
        require(from == tokenOwner[tokenId], "you are not the owner of the token");

        _removeTokenFromList(from, tokenId);
        _ownedTokens[to].push(tokenId);

        tokenOwner[tokenId] = to;

        // 만약에 받는 쪽이 실행할 코드가 있는 스마트 컨트랙트면 코드를 실행
        require(
            _checkOnKIP17Received(from, to, tokenId, _data), "KIP17: transfer to non KIP17Receiver implementer"
        );
    }

    function _checkOnKIP17Received(address from, address to, uint256 tokenId, bytes memory _data) internal returns (bool) {
        bool success;
        bytes memory returndata;

        if (!isContract(to)) {
            return true;
        }

        (success, returndata) = to.call (
            abi.encodeWithSelector(
                _KIP17_RECEIVED,
                msg.sender,
                from,
                tokenId,
                _data
            )
        );
        if (
            returndata.length != 0 &&
            abi.decode(returndata, (bytes4)) == _KIP17_RECEIVED
        ) {
            return true;
        }
        return false;
    }

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(account) }
        return size > 0;
    }




    function _removeTokenFromList(address from, uint256 tokenId) private {
        // [10, 15, 19, 20] => 19를 삭제
        // [10, 15, 20, 19] => 19를 마지막으로 정렬
        // [10, 15, 20] => 마지막 길이 하나 줄이기
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        for (uint256 i=0; i<_ownedTokens[from].length; i++) {
            if (tokenId == _ownedTokens[from][i]) {
                // Swap last token with deleting token
                _ownedTokens[from][i] = _ownedTokens[from][lastTokenIndex];
                _ownedTokens[from][lastTokenIndex] = tokenId;
                break;
            }
        }
        _ownedTokens[from].length--;
    }

    function ownedTokens(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function setTokenUri(uint256 id, string memory uri) public {
        tokenURIs[id] = uri;
    }
}

contract NFTMarket {
    mapping (uint256 => address) public seller; // 판매자

    function buyNFT(uint256 tokenId, address NFTAddress) public returns (bool) {
        // 구매한 사람한데 0.01 KLAY 전송
        address payable receiver = address(uint160(seller[tokenId]));

        // Send 0.01 KLAY at receiver
        // 10 ** 18 PEB = 1 KLAY
        // 10 ** 16 PEB = 0.01 KLAY
        receiver.transfer(10 ** 16);

        NFTSimple(NFTAddress).safeTransferFrom(address(this), msg.sender, tokenId, '0x00');

        return true;
    }

    // Market이 토큰을 받았을 때 (판매대에 올라갔을 때), 판매자가 누구인지 기록해야 함
    function onKIP17Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes) {
        seller[tokenId] = from;

        return bytes4(keccak256("onKIP17Received(address, address, uint256, bytes)"));
        // 스마트 컨트랙트가 실행할 때, 특정한 암호문(?)을 리턴
    }


}