import React, { useState } from 'react';
import { ListFilter, Trash2 } from 'lucide-react';
import '../styles/Filters.css';
import { FilterModal } from './FilterModal'
import { useEffect } from 'react';

export const Filters = ({ inputSearch, setInputSearch, SelectedFilter, setSelectedFilter, maxAmount }) => {


  const MIN_BOUND = 0;
  const MAX_BOUND = maxAmount;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [rangeValue, setRangeValue] = useState([MIN_BOUND, MAX_BOUND]);

  const handleFilterSelect = (option) => {
    setIsFilterModalOpen(false);
    setSelectedFilter(option);
  }

  const handleClearFilter = () => {
    setSelectedFilter(null);
    setRangeValue([MIN_BOUND, MAX_BOUND]);
  }
  
  useEffect(() => {
    setRangeValue([MIN_BOUND,MAX_BOUND]);
  },[maxAmount]);

  return (
    <>

      <div className='filters'>
        <input type='text' placeholder='Search...' value={inputSearch} onChange={({ target }) => setInputSearch(target.value)} ></input>
        <button htmlFor='search' onClick={setIsFilterModalOpen(true)}><ListFilter /></button>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFiltereSelect={handleFilterSelect}
        rangeValue={rangeValue}
        setRangeValue={setRangeValue}
        MIN_BOUND={MIN_BOUND}
        MAX_BOUND={MAX_BOUND}
      />

      {SelectedFilter && (
        <div className='selected-filter'>
          <span className='filter-label'>
            Filter: Min: {SelectedFilter.min} - Max: {SelectedFilter.max}
          </span>
          <Trash2 onClick={handleClearFilter} className='clear-filter-icon' />
        </div>
      )}

    </>
  )
}
