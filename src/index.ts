import bigNumber from 'bignumber.js';
import { parse, stringify } from 'json-bigint';
import { rpn } from './utils';
bigNumber.prototype.toString = bigNumber.prototype.toFixed;

export const math = rpn.calculate;
export const BigNumber = bigNumber;
export const JSON = { parse, stringify };

