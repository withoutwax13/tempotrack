interface PaginationProps {
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  currentPage: number;
  totalPages: number;
}

const Pagination = ({
  handlePreviousPage,
  handleNextPage,
  currentPage,
  totalPages,
}: PaginationProps) => (
  <div className="flex justify-center mt-4">
    <button
      className={`btn btn-secondary mx-2 ${currentPage === 1 ? 'text-gray-500' : ''}`}
      onClick={handlePreviousPage}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span className="mx-2">
      Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
    </span>
    <button
      className={`btn btn-secondary mx-2 ${currentPage === totalPages ? 'text-gray-500' : ''}`}
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
);

export default Pagination;
