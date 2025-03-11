import '../styles/Items.css';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';
import { createIncome, getIncomes, deleteIncome, updateIncome } from '../api/income.js';
import { CURRENCY_SYMBOLS } from '../constants/index.js';
import './Filters.jsx'



export const Incomes = () => {

  const [isPending, setIsPending] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [editIncome, setEditIncome] = useState(null);
  const [inputSearch, setInputSearch] = useState('');
  const [SelectedFilter, setSelectedFilter] = useState(null);
  const { user } = useAuth();

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const amountRef = useRef(null);
  const tagRef = useRef(null);
  const currencyRef = useRef(null);


  const maxAmount = incomes.length ? Math.max(...incomes.map((income) => income.amount)) : 0;


  const filteredIncomes = incomes?.filter((income) => {
    const matchSearch = income.title.toLowerCase().includes(inputSearch.toLowerCase());
    if (SelectedFilter && SelectedFilter.type === 'amount') {
      return (matchSearch && income.amount >= SelectedFilter.min && income.amount <= SelectedFilter.max);
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
      if (editIncome) {
        const data = await updateIncome(user.id, editIncome._id, payload);
        toast.success(data.message);
        resetFields();
        setEditIncome(null);


      } else {
        const data = await createIncome(payload);
        toast.success(data.message);
        resetFields();
        setIncomes((prevIncomes) => [...prevIncomes, data.income]);
        const updatedIncomess = await getIncomess(user.id);
        setIncomess(updatedIncomess);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };



  const deleteIncomess = async (incomesId) => {
    const userId = user.id;
    try {
      setIsPending(true);
      const data = await deleteIncomes(userId, incomesId);
      toast.success(data.message);
      const updatedIncomess = await getIncomess(user.id);
      setIncomess(updatedIncomess);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  }


  const handelEditIncomes = async (incomes) => {
    setEditIncomes(incomes);
    titleRef.current.value = incomes.title;
    descriptionRef.current.value = incomes.description;
    amountRef.current.value = incomes.amount;
    tagRef.current.value = incomes.tag;
    currencyRef.current.value = incomes.currency;
  }


  useEffect(() => {
    if (editIncomes) return;
    const fetchData = async () => {
      const data = await getIncomess(user.id);
      setIncomess(data);
    };
    fetchData();
  }, [editIncomes])


  return (
    <main className='item-container'>
      <h1>Incomess</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>Title</label>
          <input type='text' ref={titleRef} id='title' required placeholder='Enter incomes title' />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input type='text' ref={descriptionRef} id='description' placeholder='Enter incomes description' />
        </div>
        <div>
          <label htmlFor='amount'>Amount</label>
          <input type='number' ref={amountRef} inputMode='numeric' id='amount' required placeholder='Enter incomes amount' />
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
        <button type='submit' className='item-button' disabled={isPending}>{editIncomes ? 'Update' : 'Add'} Incomes</button>
      </form>


      <Filter inputSearch={inputSearch} setInputSearch={setInputSearch} SelectedFilter={SelectedFilter} setSelectedFilter={setSelectedFilter} maxAmount={maxAmount} />

      {filteredIncomess.length ? (<table className='item-table'>
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
          {filteredIncomess.map((incomes) => (
            <tr key={incomes._id}>
              <td>{incomes.title}</td>
              <td>{incomes.description}</td>
              <td>{incomes.amount} {CURRENCY_SYMBOLS[incomes.currency]} </td>
              <td>{incomes.tag}</td>
              <td> 
                <div className='action-buttons'>
                  <button className='edit-button' disabled={isPending} onClick={() => handelEditIncomes(incomes)}>Edit</button>
                  <button className='delete-button' disabled={isPending} onClick={() => deleteIncomess(incomes._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}


        </tbody>
      </table>) : inputSearch ? (<p className='not-found'>"{inputSearch}" Not Found</p>) : (<p className='not-found'>No Incomes Found...</p>)};
    </main>
  )
}