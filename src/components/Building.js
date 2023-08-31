import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
// Import Assets
import MetalMap from '../assets/MetalMap.png';
import MetalNormalMap from '../assets/MetalNormalMap.png';
import image1 from '../assets/1.png';
import image2 from '../assets/2.png';
import image3 from '../assets/3.png';
import image4 from '../assets/2.png';
import image5 from '../assets/3.png';

/**
     * https://community.infura.io/t/web3-js-how-to-retrieve-and-display-an-nft-erc-721-erc-1155/5346
     * 17Aug
     * * To get token
     */
import Web3 from 'web3'; 
async function getNFTMetadata(contract, tokenId) {
    const result = await contract.methods.tokenURI(tokenId).call()

    //console.log(result); // ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/101
    const ipfsURL = addIPFSProxy(result);

    const request = new Request(ipfsURL);
    const response = await fetch(request);
    const metadata = await response.json();
    //console.log(metadata); // Metadata in JSON

    //downloadImage(addIPFSProxy(metadata.image), tokenId+".jpg");
    console.log("TODO auto download asset to "+tokenId+".jpg");
    console.log(addIPFSProxy(metadata.image));
}
function addIPFSProxy(ipfsHash) {
    const URL = "https://ipfs.io/ipfs/"
    const hash = ipfsHash.replace(/^ipfs?:\/\//, '')
    const ipfsURL = URL + hash

    //console.log(ipfsURL) 
    return ipfsURL
}
const https = require('https');
const fs = require('fs');
async function downloadImage (imageUrl , imagePath) {
    const file = fs.createWriteStream(imagePath);

    https.get(imageUrl, response => {
    response.pipe(file);
    
    file.on('finish', () => {
        file.close();
        console.log(`Image downloaded as ${imagePath}`);
    });
    }).on('error', err => {
    fs.unlink(imagePath);
    console.error(`Error downloading image: ${err.message}`);
    });
}
const tokenURIABI = [{
        "inputs": [{
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
/*
const tokenContract = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" // BAYC contract address
const tokenIds = [1,2,3] // tokens we'd like to retrieve its metadata of
let images=[]; 
let web3ape = new Web3(window.ethereum);
for(let i=0; i<tokenIds.length; i++){
// TODO fix hardcoded    images[i] = getNFTMetadata(new web3ape.eth.Contract(tokenURIABI, tokenContract), tokenIds[i]);
}*/
let images=[image1, image2, image3, image4, image5];  // TODO remove hardcode
const Building = ({ position, size, landId, landInfo, setLandName, setLandOwner, setHasOwner, setLandId }) => {
    const [surface, color] = useLoader(TextureLoader, 
     //[MetalNormalMap, MetalMap]);
     [images[(landId-1) % images.length],images[(landId-1) % images.length]]); //TODO hardcoded
    //let image=images[landId%images.length];
    const clickHandler = () => {
        setLandName(landInfo.name)
        setLandId(landId)

        if (landInfo.owner === '0x0000000000000000000000000000000000000000') {
            setLandOwner('No Owner')
            setHasOwner(false)
        } else {
            setLandOwner(landInfo.owner)
            setHasOwner(true)
        }
    }
    
    return (
        <mesh position={position} onClick={clickHandler}>
            <boxBufferGeometry args={size} />        
            <meshStandardMaterial map={color} normalMap={surface} metalness={0.25} />
        </mesh>
    );
}

export default Building;