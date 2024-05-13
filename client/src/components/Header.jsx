import { FaSearch } from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Header() {



  const { currentUser } = useSelector(state => state.user)

  console.log(currentUser)
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
        <h1 className="flex flex-wrap font-bold text-xl sm:text-2xl">
          <span className="text-slate-400">DOGS</span>
          <span className="text-slate-500">App</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-2 rounded-lg flex items-center">
          <input type="text" placeholder="Search..." className="bg-transparent focus: outline-none w-24 sm:w-64" />
          <FaSearch className='text-slate-400' />
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
          <li className='hidden sm:inline text-slate-500 hover:text-slate-600'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-500 hover:text-slate-600'>About</li>
          </Link>
          <Link to={currentUser ? '/profile': '/sign-in'}>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover opacity-50' src={currentUser?.avatar || currentUser?.rest.avatar} alt='' />
            ) : <li className = 'sm:inline text-slate-500 hover:text-slate-600'>Sign In</li>
          }
          </Link>
        </ul>
      </div>
    </header>
  )
}
