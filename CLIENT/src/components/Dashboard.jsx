import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { getExpensesSum } from '../api/expense';
import {getIncomesSum} from '../api/income'
import { BarChart, LineChart } from './charts';
import '../styles/Dashboard.css';
export const Dashboard = () => {
  const {user} = useAuth();
  const [totalExpense,setTotalExpense] = useState(0);
  const [totalIncome,setTotalIncome] = useState(0);


  useEffect(() => {
    const fetchTotalItems = async () => {
      const expenseSum = await getExpensesSum(user.id);
      setTotalExpense(expenseSum);
      const incomeSum = await getIncomesSum(user.id);
      setTotalIncome(incomeSum);
    };
    

    fetchTotalItems();
  }, [])




  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <h1>Welcome {user.fullName}</h1>
        </header>

        <div className='summary'>
          <div className="card income">
            <h2>Total Incomes</h2>
            <p>${totalIncome}</p>
          </div>

          
          <div className="card expenses">
            <h2>Total Expenses</h2>
            <p>${totalExpense}</p>
            </div>
          <div className="card balance">
            <h2>Total Balance</h2>
            <p>${totalIncome-totalExpense}</p>
          </div>

          <div className="charts">
            <LineChart/>
            <BarChart/>
          </div>
    </div>
  </div>
  )
}
