import ReactPaginate from "react-paginate";
import React, {
  useEffect,
  useState
} from "react";

import { pagingConfig } from "~/conf/conf";


const Paginate = ({ fetchClassList,itemsPerPage, pageCount, currentPage}) => {

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    console.log(`User requested page number ${event.selected}`);
    fetchClassList(event.selected + 1, pagingConfig.LIMIT)
    // fetchtListUserWithPaginate(event.selected + 1);
  };

  return (
    <>
      {/* <Items currentItems={currentItems} /> */}
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={itemsPerPage}
        marginPagesDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
        forcePage={currentPage} // Đặt trang hiện tại
      />
    </>
  );

}

export default Paginate;