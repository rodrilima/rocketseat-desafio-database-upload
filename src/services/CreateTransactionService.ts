import { getRepository ,getCustomRepository } from 'typeorm'

// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository'

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const categoryFound = await categoryRepository.findOne({ title: category })

    const transactionCategory = categoryFound
    || await categoryRepository.create({ title: category })

    if(!categoryFound) await categoryRepository.save(transactionCategory)

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
