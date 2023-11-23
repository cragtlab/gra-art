async function fetchJSON(jsonFilePath) {
    return await fetch(jsonFilePath)
        .then((response) => response.json())
        .then((contractJSON) => {
            return contractJSON;
        })
        .catch((error) => {
            console.error('Error loading JSON:', error);
        });
}
let web3, accounts, networkId;
let contractJSON, contract, paintingAddress, vipJSON, vipContract;
let web3Paintings, web3Names;
async function clickConnect() {
    web3 = new Web3(window.ethereum);
    try {
        web3.eth.requestAccounts(); // for edge to work else accounts.length 0?
        accounts = await web3.eth.getAccounts();
        networkId = await web3.eth.net.getId();
    } catch (ex) {
        // all for the sake of non-wallet users
        console.error(ex);
        console.log("for non-wallet users, defaulting to 80001 network Id for mumbai for web3Painting only. cannot do auction else rated limited cause refreshing every s");

        let rpc = "https://rpc-mumbai.maticvigil.com/v1/9699793cf270b63215f6aa760a938012551a80b1";
        provider = new Web3.providers.HttpProvider(rpc);
        web3x = new Web3(provider);
        networkId = await web3x.eth.net.getId();

        contractJSON = await fetchJSON("/src/abis/Painting.json");
        paintingAddress = contractJSON.networks[networkId].address;
        contractX = await new web3x.eth.Contract(contractJSON.abi, paintingAddress);

        // try take name first as showing walletAddress
        web3Names = await contractX.methods.getNames().call(); // getNames
        web3Paintings = await contractX.methods.getPaintings().call();
        

        try {
            auction_painting_id = await contractX.methods.getAuctionPaintingID().call();
            loadAuctionPainting(await contractX.methods.getAuctionPaintingID().call());// getAuctionPaintingID());
        } catch (ex) {

            // mobile load the auction slower so need this. code in gltf loader to show 
        }


        // store array into names[wallet_address] map
        /* cannot 
            /*
        */
    }
    contractJSON = await fetchJSON("/src/abis/Painting.json");
    paintingAddress = contractJSON.networks[networkId].address;
    contract = await new web3.eth.Contract(contractJSON.abi, paintingAddress);

    vipJSON = await fetchJSON("/src/abis/VIPNFT.json");
    vipContract = await new web3.eth.Contract(vipJSON.abi, vipJSON.networks[networkId].address);

  
    refreshData();
}
function changeName() {
    addName();
}
function checkVIP() {
    vipContract.methods.balanceOf(accounts[0], 1).call().then(function (result2) {
        return result2 > 0
    });
}

function getVIP() {
    vipContract.methods.mint(accounts[0]).send({ from: accounts[0] }).then(function (result) {
        vipContract.methods.balanceOf(accounts[0], 1).call().then(function (result2) {
            if (result2 > 0) {
                alert("Congratulations, you are now a VIP");
            } else {
                alert("Failed to Become VIP. Please try again"); // maybe user cancel
            }

        });
    });
}


async function refreshData() {
    web3Paintings = await contract.methods.getPaintings().call()
    web3Names = await getNames(); // store array into names[wallet_address] map
    //console.log(web3Paintings);
    // show listed if listed
    for(i=0;i<web3Paintings.length;i++){
        // 0 price AND not minted yet
        if( (web3Paintings[i].list_price === "0" || web3Paintings[i].list_price === 0)
            && web3Paintings[i].owner !="0x0000000000000000000000000000000000000000"){
            paintingLabels[i].visible=false; 
            paintingLabels[i].scale.set(0,0,0); // somehow visible fail
        }else{
            paintingLabels[i].visible=true; 
            paintingLabels[i].scale.set(1,1,1); // somehow visible fail
        }
    }
    //console.log(web3Names);

    // for index.html only, not index2.html
    if (typeof (loadAuctionPainting) != 'undefined') {
        connectBtn.textContent = getNiceName(accounts[0]);
        changeNameBtn.style.display = '';
        vipContract.methods.balanceOf(accounts[0], 1).call().then(function (result2) {
            if (result2 > 0) {
                getVIPBtn.style.display = '';
                getVIPBtn.innerHTML = '🌟VIP🌟';
                getVIPBtn.disabled = 'disabled';
            } else {
                getVIPBtn.style.display = '';
                getVIPBtn.innerHTML = 'Get VIP';
                getVIPBtn.disabled = '';
            }
        });
        loadAuctionPainting(await getAuctionPaintingID())
    }
}

function getNiceName(walletAddress) {
    if (!web3Names) {
        //console.log("what is this");
        if (walletAddress.length > 5) {
            return walletAddress.substring(0, 5) + "..";
        }
        return walletAddress; // somehow happen at init
    }
    for (lookup of web3Names) {
        if (lookup.wallet_address.toLowerCase() === walletAddress.toLowerCase()) {
            return lookup.name;
        }
    }

    // real wallet address instead of explorer
    if (walletAddress.length > 5) {
        return walletAddress.substring(0, 5) + "..";
    }
    return walletAddress;
}
async function getNames() {
    return await contract.methods.getNames().call();
}
async function addName(name) {
    name = prompt("Choose Your Name");
    if (name) {
        await contract.methods.addName(accounts[0], name).send({ from: accounts[0] });
    }
}

async function getAuctionPaintingID() {
    return contract.methods.getAuctionPaintingID().call();
}
async function getAuctionExpiryDate() {
    return contract.methods.getAuctionExpiryDate().call();
}
async function getBids() {
    return contract.methods.getBids().call();
}
async function getAuctionDetails() {
    id = await getAuctionPaintingID();
    time = await getAuctionExpiryDate();
    bids = await getBids();
    return [id, time, bids];
}
async function addBid(amount) {
    contract.methods.addBid(amount).send({ from: accounts[0] });
}
async function payAuction() {
    bids = await contract.methods.getBids().call();
    contract.methods.payAuction().send({ from: accounts[0], value: bids[bids.length - 1].amount });
}


async function mintPainting(id) {
    try {
        await contract.methods.mint(id).send({ from: accounts[0], value: '1000000000000000' }) // 0.001
        refreshData();// to update ownership
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function listPainting(id, list_price) {
    try {
        //price=web3.utils.toWei(list_price, 'ether');
        await contract.methods.listToken(id, list_price).send({ from: accounts[0] })
        refreshData(); // to update 
    } catch (ex) {
        window.alert("Error Listing Painting");
    }
}
async function buyPainting(id) {
    try {
        await contract.methods.buyToken(id).send({ from: accounts[0], value: web3Paintings[id - 1].list_price }) // 0.001
        refreshData(); // to update painting
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function getPainting(id) {
    return web3Paintings[id];
}
setTimeout(() => { clickConnect(); }, 5000); // connect at start after things loadup?
