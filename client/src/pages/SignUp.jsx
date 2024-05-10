import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg focus: outline-none bg-slate-100"
          id="username" />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg focus: outline-none bg-slate-100"
          id="email" />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg focus: outline-none bg-slate-100"
          id="password" />
        <button
         // disabled
          className="bg-slate-600 text-white p-3 rounded-md uppercase hover:opacity-95 disabled:opacity-80">Sign Up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-slate-600 hover:underline'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
