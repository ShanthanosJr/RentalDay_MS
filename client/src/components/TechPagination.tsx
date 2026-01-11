import React from 'react';

interface TechPaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
  prevPage: () => void;
  nextPage: () => void;
}

const TechPagination: React.FC<TechPaginationProps> = ({ 
  itemsPerPage, 
  totalItems, 
  paginate, 
  currentPage,
  prevPage,
  nextPage 
}) => {
  const pageNumbers = [];

  // Calculate total pages required
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // If there's only 1 page, don't show controls
  if (pageNumbers.length <= 1) return null;

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination">
        {/* PREV BUTTON */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            onClick={prevPage} 
            className="page-link rounded-0 bg-transparent text-success border-success fw-bold"
            style={{ marginRight: '5px' }}
          >
            &lt; PREV
          </button>
        </li>

        {/* PAGE NUMBERS */}
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button 
              onClick={() => paginate(number)} 
              className={`page-link rounded-0 border-success fw-bold mx-1 ${
                currentPage === number 
                  ? 'bg-success text-white' 
                  : 'bg-transparent text-success'
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* NEXT BUTTON */}
        <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
          <button 
            onClick={nextPage} 
            className="page-link rounded-0 bg-transparent text-success border-success fw-bold"
            style={{ marginLeft: '5px' }}
          >
            NEXT &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TechPagination;