import '../styles/Items.css';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';
import { createExpense, getExpenses, deleteExpense, updateExpense } from '../api/expense.js';
import { CURRENCY_SYMBOLS } from '../constants/index.js';
import './Filters.jsx'



export const Expenses = () => {

  const [isPending, setIsPending] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [inputSearch, setInputSearch] = useState('');
  const [SelectedFilter, setSelectedFilter] = useState(null);
  const { user } = useAuth();

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);


  const maxAmount = expenses.length ? Math.max(...expenses.map((expense) => expense.amount)) : 0;


  const filteredExpenses = expenses?.filter((expense) => {
    const matchSearch = expense.title.toLowerCase().includes(inputSearch.toLowerCase());
    if (SelectedFilter && SelectedFilter.type === 'amount') {
      return (matchSearch && expense.amount >= SelectedFilter.min && expense.amount <= SelectedFilter.max);
    }
    return matchSearch;
  });

  const resetFields = () => {
    titleRef.current.value = '';
    descriptionRef.current.value = '';
    amountRef.current.value = '';
    tagRef.current.value = 'food';
    currencyRef.current.value = 'EUR';
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = titleRef.current.value;
    const description = descriptionRef.current?.value;
    const amount = amountRef.current.value;
    const tag = tagRef.current.value;
    const currency = currencyRef.current.value;

    const payload = {
      userId: user.id,
      title,
      description,
      amount: Number(amount),
      tag,
      currency
    };


    try {
      setIsPending(true);
      if (editExpense) {
        const data = await updateExpense(user.id, editExpense._id, payload);
        toast.success(data.message);
        resetFields();
        setEditExpense(null);


      } else {
        const data = await createExpense(payload);
        toast.success(data.message);
        resetFields();
        setExpenses((prevExpenses) => [...prevExpenses, data.expense]);
        const updatedExpenses = await getExpenses(user.id);
        setExpenses(updatedExpenses);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };



  const deleteExpenses = async (expenseId) => {
    const userId = user.id;
    try {
      setIsPending(true);
      const data = await deleteExpense(userId, expenseId);
      toast.success(data.message);
      const updatedExpenses = await getExpenses(user.id);
      setExpenses(updatedExpenses);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  }


  const handelEditExpense = async (expense) => {
    setEditExpense(expense);
    titleRef.current.value = expense.title;
    descriptionRef.current.value = expense.description;
    amountRef.current.value = expense.amount;
    tagRef.current.value = expense.tag;
    currencyRef.current.value = expense.currency;
  }


  useEffect(() => {
    if (editExpense) return;
    const fetchData = async () => {
      const data = await getExpenses(user.id);
      setExpenses(data);
    };
    fetchData();
  }, [editExpense])


  return (
    <main className='item-container'>
      <h1>Expenses</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title</label>
          <input type='text' ref={titleRef} id='title' required placeholder='Enter expense title' />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input type='text' ref={descriptionRef} id='description' placeholder='Enter expense description' />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input type='number' ref={amountRef} inputMode='numeric' id='amount' required placeholder='Enter expense amount' />
        </div>
        <div>
          <label htmlFor='tag'>Tag</label>
          <select id='tag' ref={tagRef} required>
            <option value='food'>Food</option>
            <option value='rent'>Rent</option>
            <option value='transport'>Transport</option>
            <option value='clothing'>Clothing</option>
            <option value='entertainment'>Entertainment</option>
            <option value='health'>Health</option>
            <option value='education'>Education</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor='currency'>Currency</label>
          <select id='currency' ref={currencyRef}>
            <option value='EUR'>EUR</option>
            <option value='USD'>USD</option>
            <option value='ILS'>ILS</option>
          </select>
        </div>
        <button type='submit' className='item-button' disabled={isPending}>{editExpense ? 'Update' : 'Add'} Expense</button>
      </form>


      <Filter inputSearch={inputSearch} setInputSearch={setInputSearch} SelectedFilter={SelectedFilter} setSelectedFilter={setSelectedFilter} maxAmount={maxAmount} />

      {filteredExpenses.length ? (<table className='item-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.title}</td>
              <td>{expense.description}</td>
              <td>{expense.amount} {CURRENCY_SYMBOLS[expense.currency]} </td>
              <td>{expense.tag}</td>
              <td> 
                <div className='action-buttons'>
                  <button className='edit-button' disabled={isPending} onClick={() => handelEditExpense(expense)}>Edit</button>
                  <button className='delete-button' disabled={isPending} onClick={() => deleteExpenses(expense._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}


        </tbody>
      </table>) : inputSearch ? (<p className='not-found'>"{inputSearch}" Not Found</p>) : (<p className='not-found'>No Expense Found...</p>)};
    </main>
  )
}