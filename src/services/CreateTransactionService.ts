import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('Not have founds');
    }

    const categoryRepository = getRepository(Category);

    const categoryFound = await categoryRepository.findOne({ title: category });

    const transactionCategory =
      categoryFound || categoryRepository.create({ title: category });

    if (!categoryFound) await categoryRepository.save(transactionCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
