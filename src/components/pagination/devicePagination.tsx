import { ReactNode, useCallback } from 'react'
import PaginationPerpage from './paginationPerpage'
import { SingleValue } from 'react-select'
import { Option } from '../../types/global/hospitalAndWard'
import { useTranslation } from 'react-i18next'

type PaginationProps<T> = {
  data: T[];
  initialPerPage: number;
  itemPerPage: number[];
  renderItem: (item: T, index: number) => ReactNode;
  handlePageChange: (page: number) => void
  handlePerRowsChange: (newPerPage: number, page: number) => Promise<void>
  totalRows: number
  currentPage: number
}

const DevicePagination = <T,>({
  data,
  initialPerPage,
  renderItem,
  itemPerPage,
  handlePageChange,
  handlePerRowsChange,
  totalRows,
  currentPage,
}: PaginationProps<T>) => {
  const { t } = useTranslation()

  const totalPages = Math.ceil(totalRows / initialPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page)
    }
  }

  const handlePerPageChange = useCallback((event: SingleValue<Option>) => {
    handlePerRowsChange(Number(event?.value), currentPage)
  }, [currentPage])

  const generatePagination = () => {
    const pages: ReactNode[] = []

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`join-item btn ${currentPage === i ? 'btn-neutral' : 'bg-base-300 border-base-300'}`}
                    onClick={() => i !== currentPage && goToPage(i)}
                >
                    {i}
                </button>
            )
        }
    } else {
        pages.push(
            <button
                key={1}
                className={`join-item btn ${currentPage === 1 ? 'btn-neutral' : ''}`}
                onClick={() => currentPage !== 1 && goToPage(1)}
            >
                1
            </button>
        )

        if (currentPage > 3) {
            pages.push(<button key="start-dots" className="join-item btn btn-disabled">...</button>)
        }

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`join-item btn ${currentPage === i ? 'btn-neutral' : ''}`}
                    onClick={() => currentPage !== i && goToPage(i)}
                >
                    {i}
                </button>
            )
        }

        if (currentPage < totalPages - 2) {
            pages.push(<button key="end-dots" className="join-item btn btn-disabled">...</button>)
        }

        pages.push(
            <button
                key={totalPages}
                className={`join-item btn ${currentPage === totalPages ? 'btn-neutral' : ''}`}
                onClick={() => currentPage !== totalPages && goToPage(totalPages)}
            >
                {totalPages}
            </button>
        )
    }

    return pages
  }


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7 content-center justify-items-center mt-5">
        {data.map((item, index) => renderItem(item, index))}
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center mt-5 gap-4">
        <label className="flex items-center gap-2">
          <span>{t('selectPerPage')}</span>
          <PaginationPerpage
            perPage={itemPerPage}
            value={initialPerPage}
            handlePerPageChange={handlePerPageChange} />
        </label>

        <div className="join">
        <button
            className={`join-item btn bg-base-300 ${currentPage !== 1 ? 'border-base-300' : ''}`}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          {generatePagination()}
          <button
            className={`join-item btn bg-base-300 ${currentPage !== totalPages ? 'border-base-300' : ''}`}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </>
  )
}

export default DevicePagination
