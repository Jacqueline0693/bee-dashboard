import { BigNumber } from 'bignumber.js'
import { Token } from './Token'

export class DaiToken extends Token {
  constructor(amount: BigNumber | string | bigint) {
    super(amount, 18)
  }
}
