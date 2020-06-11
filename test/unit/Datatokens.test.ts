import { assert } from 'chai'
import { TestContractHandler } from './TestContractHandler'
import { DataTokens } from '../../src/datatokens/Datatokens'

const Web3 = require('web3')
const web3 = new Web3("http://127.0.0.1:8545")

const factoryABI = require('../../src/datatokens/FactoryABI.json')
const datatokensABI = require('../../src/datatokens/DatatokensABI.json')

describe('DataTokens', () => {

    let minter
    let spender
    let balance
    let contracts
    let datatoken
    let tokenAddress

    let tokenAmount = 100
    let blob = 'https://example.com/dataset-1'

    describe('#test', () => {
        it('should deploy contracts', async () => {
            contracts = new TestContractHandler(factoryABI,datatokensABI)
            await contracts.getAccounts()
            minter = contracts.accounts[0]
            spender = contracts.accounts[1]
            await contracts.deployContracts(minter)
        })

        it('should create Datatoken object', async () => {
            datatoken = new DataTokens(contracts.factoryAddress, factoryABI, datatokensABI, web3)
            assert(datatoken !== null)
        })

        it('should create Datatoken contract', async () => {
            tokenAddress = await datatoken.create(blob, minter)
            assert(tokenAddress !== null)
        })

        it('should mint Datatokens', async () => {
            await datatoken.mint(tokenAddress, minter, tokenAmount)
            balance = await datatoken.balance(tokenAddress, minter)
            assert(balance.toString() === tokenAmount.toString())
        })

        it('should transfer Datatokens to spender', async () => {
            await datatoken.transfer(tokenAddress, spender, tokenAmount, minter)
            balance = await datatoken.balance(tokenAddress, spender)
            assert(balance.toString() === tokenAmount.toString())

        })

        it('should approve Datatokens to spend', async () => {
            await datatoken.approve(tokenAddress, minter, tokenAmount, spender)
        })

        it('should transferFrom Datatokens back to the minter', async () => {
            await datatoken.transferFrom(tokenAddress, spender, tokenAmount, minter)
            minter = await datatoken.balance(tokenAddress, spender)
            assert(balance.toString() === tokenAmount.toString())
        })

    })
})