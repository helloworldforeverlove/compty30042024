import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient'; // Adjust path as necessary
import TransactionItem from './TransactionItem';

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      let { data: transactions, error } = await supabase
        .from('transactions')
        .select('*');

      if (error) {
        console.log('Error fetching data: ', error);
      } else {
        setTransactions(transactions);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}

export default TransactionsList;