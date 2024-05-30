import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {

  const { currentUser } = useSelector(state => state.user)
  console.log(currentUser)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm.trim())
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermUrl = urlParams.get('searchTerm')
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl.trim())
    }

  }, [location.search])

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
          <h1 className="flex flex-wrap font-bold text-xl sm:text-2xl">
            <span className="text-slate-400">DOGS</span>
            <span className="text-slate-500">App</span>
          </h1>
        </Link>
        <form onSubmit={(e)=> handleSubmit(e)} className="bg-slate-100 p-2 rounded-lg flex items-center">
          <input type="text" placeholder="Search..." className="bg-transparent focus: outline-none w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-400' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-500 hover:text-slate-600'>Home</li>
          </Link>
          <Link to='/contact'>
            <li className='hidden sm:inline text-slate-500 hover:text-slate-600'>Contact</li>
          </Link>
          <Link to={currentUser ? '/profile' : '/sign-in'}>
            {currentUser ? (
              <img className='rounded-full h-7 w-7 object-cover opacity-90' src={currentUser?.avatar || currentUser?.avatar} alt='avatar' />
            ) : <li className='sm:inline text-slate-500 hover:text-slate-600'>Sign In</li>
            }
          </Link>
          {currentUser && <Link to='/profile'>
            <li className='hidden sm:inline text-slate-500 hover:text-slate-600'>Hola, <span className='font-semibold'>{currentUser?.username.split(' ')[0]}</span>!</li>
          </Link>}
        </ul>
      </div>
    </header>
  )
}
