import path from 'path';
import fs from 'fs-extra';
import solc from 'solc';

import { BUILD_FOLDER, CONTRACT_FOLDER } from './constants';
import { ICompileContractParam } from './interfaces/contract';

const buildPath = path.resolve(__dirname, BUILD_FOLDER);
const contractPath = path.resolve(__dirname, CONTRACT_FOLDER, 'Inbox.sol');
const contractContent = fs.readFileSync(contractPath, 'utf8');

const compileContract = ({ name, className, source }: ICompileContractParam) => {
  const input = {
    language: 'Solidity',
    sources: {
      [name]: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts[name][className];
  return contract;
};
