import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-slate-200 p-4 text-center">
      <p className="text-slate-600 font-semibold">&copy; {new Date().getFullYear()} DogsLovers App by <Link  className='text-slate-800' to='/magaerv'>Magaerv</Link></p>
    </footer>
  )
}

export default Footer