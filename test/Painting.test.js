const Painting = artifacts.require("./Painting")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('Painting', ([owner1, owner2]) => {

    const NAME = 'DApp U Buildings'
    const SYMBOL = 'DUB'
    const COST = web3.utils.toWei('0.001', 'ether')

    let painting, result

    beforeEach(async () => {
        painting = await Painting.new(NAME, SYMBOL, COST)
    })

    describe('Deployment', () => {
        it('Returns the contract name', async () => {
            result = await painting.name()
            result.should.equal(NAME)
        })

        it('Returns the symbol', async () => {
            result = await painting.symbol()
            result.should.equal(SYMBOL)
        })

        it('Returns the cost to mint', async () => {
            result = await painting.cost()
            result.toString().should.equal(COST)
        })

        it('Returns the max supply', async () => {
            result = await painting.maxSupply()
            result.toString().should.equal('20')
        })

        it('Returns the number of buildings/land available', async () => {
            result = await painting.getPaintings()
            result.length.should.equal(5)
        })
    })

    describe('Minting', () => {
        describe('Success', () => {
            beforeEach(async () => {
                result = await painting.mint(1, { from: owner1, value: COST })
            })

            it('Updates the owner address', async () => {
                result = await painting.ownerOf(1)
                result.should.equal(owner1)
            })

            it('Updates painting details', async () => {
                result = await painting.getPainting(1)
                result.owner.should.equal(owner1)
            })
        })

        describe('Failure', () => {
            it('Prevents mint with 0 value', async () => {
                await painting.mint(1, { from: owner1, value: 0 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('Prevents mint with invalid ID', async () => {
                await painting.mint(100, { from: owner1, value: 1 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('Prevents minting if already owned', async () => {
                await painting.mint(1, { from: owner1, value: COST })
                await painting.mint(1, { from: owner2, value: COST }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('Transfers', () => {
        describe('success', () => {
            beforeEach(async () => {
                await painting.mint(1, { from: owner1, value: COST })
                await painting.approve(owner2, 1, { from: owner1 })
                await painting.transferFrom(owner1, owner2, 1, { from: owner2 })
            })

            it('Updates the owner address', async () => {
                result = await painting.ownerOf(1)
                result.should.equal(owner2)
            })

            it('Updates painting details', async () => {
                result = await painting.getPainting(1);
                result.owner.should.equal(owner2)
            })
        })

        describe('failure', () => {
            it('Prevents transfers without ownership', async () => {
                await painting.transferFrom(owner1, owner2, 1, { from: owner2 }).should.be.rejectedWith(EVM_REVERT)
            })

            it('Prevents transfers without approval', async () => {
                await painting.mint(1, { from: owner1, value: COST })
                await painting.transferFrom(owner1, owner2, 1, { from: owner2 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })
})