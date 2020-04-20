import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import { valueToNode } from '@babel/types';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance = { income:0, outcome:0, total:0 };

    transactions.forEach(({ type, value }) => {
      if (type === 'income') { balance.income += value }
      if (type === 'outcome') { balance.outcome += value }
    })

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
