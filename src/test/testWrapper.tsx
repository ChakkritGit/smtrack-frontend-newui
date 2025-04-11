import { Link, Outlet, useLocation } from 'react-router-dom'

const TestWrapper = () => {
  const location = useLocation()

  return (
    <div className='p-3'>
      <div className='flex items-center gap-2'>
        <Link to={'/test'} className={`btn  ${location.pathname === '/test' ? 'btn-primary' : 'btn-ghost'}`}>Test 1</Link>
        <Link to={'test2'} className={`btn ${location.pathname === '/test/test2' ? 'btn-primary' : 'btn-ghost'}`}>Test 2</Link>
      </div>
      <div className='mt-3'>
        <Outlet />
      </div>
    </div>
  )
}

export default TestWrapper
