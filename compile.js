const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const solc = require('solc')

const CONTRACT_FOLDER = 'contracts'
const BUILD_FOLDER = 'build'

const buildPath = path.resolve(__dirname, BUILD_FOLDER)
const inboxPath = path.resolve(__dirname, CONTRACT_FOLDER, 'Inbox.sol')
const source = fs.readFileSync(inboxPath, 'utf8')

/**
 * Compiles a Solidity contract using the Solidity compiler (solc).
 * @param {string} name - The name of the contract.
 * @param {string} contract - The Solidity source code of the contract.
 */
const compileContract = (name, className, source) => {
  try {
    const contractName = `${name}.sol`
    const input = {
      language: 'Solidity',
      sources: {
        [contractName]: { content: source }
      },
      settings: {
        optimizer: {
          enabled: true
        },
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode']
          }
        }
      }
    }

    const compiled = JSON.parse(solc.compile(JSON.stringify(input)))

    if (compiled.errors) {
      throw new Error(JSON.stringify(compiled.errors, null, 2))
    }

    const contract = compiled.contracts[contractName][className]

    fsExtra.ensureDirSync(buildPath)
    fsExtra.outputJsonSync(path.resolve(buildPath, `${className}.json`), {
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object
    })

    console.log(`Contract compiled and output to ${BUILD_FOLDER}/${className}.json`)
  } catch (err) {
    console.log('err', err)
  }
}

module.exports = compileContract('inbox', 'Inbox', source)
