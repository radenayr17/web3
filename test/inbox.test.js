const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

const { abi, bytecode } = require('../build/Inbox.json');
const web3 = new Web3(ganache.provider());

let accounts = [];
let contract = null;

const INITIAL_MESSAGE = 'Hi there!';

beforeEach(async () => {
  try {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    console.log('Deploying from account', accounts[0]);

    // Use one of those accounts to deploy the contract
    contract = await new web3.eth.Contract(abi)
      .deploy({ data: `0x0${bytecode}`, arguments: [INITIAL_MESSAGE] })
      .send({ from: accounts[0], gas: '2000000' });
      
    console.log('Contract deployed to', contract.options.address);
  } catch (err) {
    console.log('err', err);
  }
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(contract.options.address);
  });

  it ('has a default message', async () => {
    const message = await contract.methods.message().call();

   assert.strictEqual(message, INITIAL_MESSAGE);
  });
})