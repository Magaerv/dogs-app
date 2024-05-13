import { useSelector } from "react-redux"

export default function Profile() {

  const { currentUser } = useSelector(state => state.user)

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">My Account</h1>
      <form className="flex flex-col gap-3">
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 opacity-50' src={currentUser?.avatar || currentUser?.rest.avatar} alt='' />
        <input type="text" placeholder="username" id='username' className="border p-3 rounded-lg mt-7" />
        <input type="text" placeholder="email" id='email' className="border p-3 rounded-lg mt-7" />
        <input type="text" placeholder="password" id='password' className="border p-3 rounded-lg mt-7" />
        <button className="bg-slate-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70">Update
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500'>Delete Account</span>
        <span className='text-red-500'>Sign Out</span>
      </div>
    </div>
  )
}
