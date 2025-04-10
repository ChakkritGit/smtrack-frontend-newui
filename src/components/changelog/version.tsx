const V2 = () => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='mt-2'>
      <span className='font-bold'>v2.0</span> - Stable version
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>
          New version as a complete rewrite of the app.
        </span>
      </div>
    </div>
  </div>
)

const DateVersion = () => {
  const currentDate: Date = new Date()
  const formattedDate = currentDate
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
    .replace(/\//g, '-')
  return (
    <div className='border-y py-3 px-2 border-base-content/10'>
      <div className='mt-2'>
        <span className='font-bold'>{formattedDate}</span> - beta version
      </div>
      <div>
        <div className='ml-3'>
          <span className='font-bold text-lg'>-</span>
          <span className='ml-3'>
            This is a test version. It may contain bugs or unexpected issues.
          </span>
        </div>
      </div>
    </div>
  )
}

export { V2, DateVersion }
