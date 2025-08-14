const V2_0_1 = () => (
  <div className='border-b py-3 px-2 border-base-content/10'>
    <div className='mt-2'>
      <span className='font-bold'>v2.0.1</span>
    </div>
    <div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>
          อัปเดตเวอร์ชันของ Dependencies เพื่อเพิ่มความเสถียรและปลอดภัย
        </span>
      </div>
      <div className='ml-3'>
        <span className='font-bold text-lg'>-</span>
        <span className='ml-3'>
          ปรับปรุงการแสดงผลของกราฟ: พื้นที่ไล่ระดับสี (Gradient)
          จะปรับทิศทางให้ถูกต้องอัตโนมัติ ไม่ว่าค่าข้อมูลจะเป็นบวกหรือลบ
        </span>
      </div>
    </div>
  </div>
)

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

export { V2, V2_0_1 }
