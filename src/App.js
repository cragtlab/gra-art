import Web3 from 'web3';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Point, PointerLockControls } from '@react-three/drei'
import { Sky, MapControls } from '@react-three/drei';

import { PerspectiveCamera } from '@react-three/drei'
import { Physics, useSphere } from '@react-three/cannon';
import { FirstPersonControls, FlyControls } from '@react-three/drei';

// Import CSS
import './App.css';

// Import Components

import Character from "./components/Character"
import Walls from "./components/Walls";
import Navbar from './components/Navbar';
import Plane from './components/Plane';
import Building from './components/Building';

// Import ABI
import Land from './abis/Land.json';
import { Vector3 } from 'three';

function App() {
	
	const [web3, setWeb3] = useState(null)
	const [account, setAccount] = useState(null)

	// Contract & Contract States
	const [landContract, setLandContract] = useState(null)

	const [cost, setCost] = useState(0)
	const [buildings, setBuildings] = useState(null)
	const [landId, setLandId] = useState(null)
	const [landName, setLandName] = useState(null)
	const [landOwner, setLandOwner] = useState(null)
	const [hasOwner, setHasOwner] = useState(false)
	
	const loadBlockchainData = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setAccount(accounts[0])
			}
			
			const networkId = await web3.eth.net.getId()
			const land = new web3.eth.Contract(Land.abi, Land.networks[networkId].address)
			setLandContract(land)

			const cost = await land.methods.cost().call()
			setCost(web3.utils.fromWei(cost.toString(), 'ether'))

			const buildings = await land.methods.getBuildings().call()
			setBuildings(buildings)

			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}
	
	//const controls=new PointerLockControls();
	useEffect(() => {
		loadBlockchainData()
	}, [account])

	

	const buyHandler = async (_id) => {
		try {
			await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000' }) // 0.001
			const buildings = await landContract.methods.getBuildings().call()
			setBuildings(buildings)

			setLandName(buildings[_id - 1].name)
			setLandOwner(buildings[_id - 1].owner)
			setHasOwner(true)
		} catch (error) {
			window.alert('Error occurred when buying')
		}
	}

	// movement and camera
	const cameraRef = useRef();
	const characterRef = useRef();
	const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });  
	useEffect(() => {
		const handleKeyDown = (e) => {
		  if (e.key === 'ArrowUp' || e.key === 'w') setMovement({ ...movement, forward: true });
		  if (e.key === 'ArrowDown'  || e.key === 's') setMovement({ ...movement, backward: true });
		  if (e.key === 'ArrowLeft'  || e.key === 'a') setMovement({ ...movement, left: true });
		  if (e.key === 'ArrowRight'  || e.key === 'd') setMovement({ ...movement, right: true });

		  const distance = 3;
		  const angle = characterRef.current.rotation.y;
		  const charPos = characterRef.current.position;
		  const offset = distance * Math.sin(angle);
		  console.log("charPos:");
		  console.log(charPos);
		  console.log("before/after");
		  console.log(cameraRef.current.position);
		  cameraRef.current.position.set(charPos.x - offset, 1.5, charPos.z - offset);
		  cameraRef.current.lookAt(charPos);
		  console.log(cameraRef.current.position);
		};
	
		const handleKeyUp = (e) => {
		  if (e.key === 'ArrowUp'  || e.key === 'w') setMovement({ ...movement, forward: false });
		  if (e.key === 'ArrowDown'  || e.key === 's') setMovement({ ...movement, backward: false });
		  if (e.key === 'ArrowLeft'  || e.key === 'a') setMovement({ ...movement, left: false });
		  if (e.key === 'ArrowRight'  || e.key === 'd') setMovement({ ...movement, right: false });
		};
	
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
	
		return () => {
		  window.removeEventListener('keydown', handleKeyDown);
		  window.removeEventListener('keyup', handleKeyUp);
		};
	  }, [movement]);
	  return (
		<div>
			
			<Navbar web3Handler={web3Handler} account={account} />
			<Canvas camera={{position:[0,-20,1]}}>	
			 	 {/* <PerspectiveCamera					
					ref={cameraRef}
					up={[0,0,1]}
					//rotation_order={"ZYX"}
					position={[0,-20,1]}
					//aspect={window.innerWidth/window.innerHeight} 
					fov={70}
					near={0.1}
					far={1000}
					makeDefault
				 /> */}				
		
				<Suspense fallback={null}>
					<Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} />
					<ambientLight intensity={0.5} />					
					
					{/* Load in each cell */}
					<Physics>
						{buildings && buildings.map((building, index) => {
							
								return (
									<Building
										key={index}
										//position={[building.posX, building.posY, 0.1]}
										position={[-20+index*10, 40, 0.1]}
										size={[8,0.1,8]}
										//size={[building.sizeX, building.sizeY, building.sizeZ]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
									/>
								)
							//}
						})}
						
					</Physics>
					<Character characterRef={characterRef} movement={movement} />

				    <Walls />
					<Plane />				
				</Suspense>
				<FirstPersonControls lookSpeed={0.00000001} movementSpeed="20"  /> 
				
				{/*lookVertical="false"/> */}
				{/*<FirstPersonControls movementSpeed="5"  /> 
				<PointerLockControls />
				<MapControls />  
				 
				
				*/}
			</Canvas>

			{landId && (
				<div className="info">
					<h1 className="flex">{landName}</h1>

					<div className='flex-left'>
						<div className='info--id'>
							<h2>ID</h2>
							<p><u><a target="_blank" href={`https://testnets.opensea.io/assets/mumbai/0xd0674b72dec23984526f9c502edd91bb8b0317a1/${landId}`}>{landId}</a></u></p>
						</div>

						<div className='info--owner'>
							<h2>Owner</h2>
							<p><u><a target="_blank" href={`https://testnets.opensea.io/${landOwner}`}>{landOwner && (landOwner.substring(0, 30) + "...")}</a></u></p>
						</div>

						{!hasOwner && (
							<div className='info--owner'>
								<h2>Cost</h2>
								<p>{`${cost}`}</p>
							</div>
						)}
					</div>

					{!hasOwner && (
						<button onClick={() => buyHandler(landId)} className='button info--buy'>Buy Property</button>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
