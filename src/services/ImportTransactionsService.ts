import parse from 'csv-parse';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  csv: Buffer;
}

class ImportTransactionsService {
  async execute({ csv }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const transactions = [] as Transaction[];
    await new Promise(resolve => {
      parse(csv, async (err, output: Array<Array<string>>) => {
        output.shift();
        for (const row of output) {
          transactions.push(
            await createTransaction.execute({
              title: row[0].trim(),
              type: row[1].trim() as 'income',
              value: Number(row[2].trim()),
              category: row[3].trim(),
            }),
          );
        }
        resolve();
      });
    });
    return transactions;
  }
}

export default ImportTransactionsService;
