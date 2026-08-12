import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react"
import { useSelector } from "react-redux"

const Pagination = ({
  currentPage,
  onPageChange,
  firstPageText = <ChevronFirst size={20} />,
  prevPageText = <ChevronLeft size={20} />,
  nextPageText = <ChevronRight size={20} />,
  lastPageText = <ChevronLast size={20} />
}) => {
  const { totalPages, products } = useSelector((state) => state.product)
  if (!products || products.length === 0 || totalPages <= 1)
    return null
  const getPageNumber = () => {
    const pageNumber = [];
    const pageWindow = 1;
    for (let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++) { pageNumber.push(i) }
    return pageNumber
  }
  const btnBase = "relative inline-flex items-center justify-center w-10 h-10 text-sm font-semibold transition-all duration-300 ease-in-out rounded-full mx-1";
  const activeBtn = "bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-600 ring-offset-2 scale-110";
  const inactiveBtn = "text-gray-600 hover:bg-blue-50 hover: text-blue-600 hover:scale-105 border border-transparent";
  const controlBtn = "bg-white border border-gray-200 text-gray-500 hover:border-blue-400 hover: text-blue-600 shadow-sm";
  return (
  <div>
    <div className="flex items-center p-2 bg-white rounded-full shadow-md border 
    border-gray-100">
      {/* << First & < prev */}
      <div className="flex gap-1 mr-2 border-r pr-2 border-gray-100">
        <button disabled={currentPage === 1}className={`${btnBase} ${controlBtn}
        disabled:opacity-30 disabled:hover:scale-100`}title="First Page" 
        onClick={()=>onPageChange(1)}>{firstPageText}</button>

        <button disabled={currentPage === 1}className={`${btnBase} ${controlBtn}
        disabled:opacity-30 disabled:hover:scale-100`}title="Previous" 
        onClick={()=>onPageChange(currentPage -1)}>{prevPageText}</button>
      </div>
      {/* Page Number */}
      <div className="flex gap-1">
        {getPageNumber().map((number) => (
          <button key={number} onClick={() => onPageChange(number)} 
          className={`${btnBase} ${currentPage === number? activeBtn : inactiveBtn}`}>{number}
          </button>
        ))}
      </div>
      {/* Next > & last >>  */}
      <div className="flex gap-1 ml-2 border-l pl-2 border-gray-100">
        <button disabled={currentPage === totalPages}className={`${btnBase} ${controlBtn}
        disabled:opacity-30 disabled:hover:scale-100`}title="Next" 
        onClick={()=>onPageChange(currentPage + 1)} >{nextPageText}</button>

        <button disabled={currentPage === totalPages}className={`${btnBase} ${controlBtn}
        disabled:opacity-30 disabled:hover:scale-100`}title="Last Page" 
        onClick={()=>onPageChange(totalPages)} >{lastPageText}</button>
      </div>
    </div>
   <div className="flex justify-center items-center w-full">
  <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-2">
    PAGE {currentPage} of {totalPages}
  </p>
</div>
  </div>
  )
}

export default Pagination
