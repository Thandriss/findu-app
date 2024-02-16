import React from 'react'
import './Pagination.css';
//element of the pagination
//all elements, paginate for changing the list of chats, if the number of page is clicked, chatsPerPage - number of chats
const Pagination = ({chatsPerPage, total, paginate}) => {

    const pageNumbers = [];
    for(let i = 1; i<= Math.ceil(total/chatsPerPage); i++) {
        pageNumbers.push(i);
    }

  return (
    <div >
        <nav className='table-responsive mb-2'>
            <ul className='pagination pagination-sm'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={() => paginate(number)} href="#" className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
  )
}

export default Pagination