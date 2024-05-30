import { Link } from "react-router-dom"
import { useSelector } from 'react-redux'

export const DogCard = ({ dog }) => {


  const userId = useSelector(state => state.user.currentUser?._id)

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow  overflow-hidden rounded-lg text-slate-700 w-full sm:w-[330px]'>
      <Link to={`/dog/${dog._id || dog.id}`}>
        <img src={dog.image[0] || dog.image.url} alt='dog cover' className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' />
        <div className="flex justify-between items-center p-3">
          <p className="text-lg uppercase font-bold truncate">{dog.name}</p>
          <p>{userId && userId === dog.userRef && (
            <button to={`/update-dog/${dog._id}`} className="text-sm bg-green-700 text-white text-center px-2 py-1 gap-3 rounded-md uppercase">
              Update
            </button>
          )}</p>
        </div>
        <div className="flex justify-between items-center px-3 mb-1">
            <p className="text-sm">{dog.fromDb ? 'Database' : 'API'}</p>
          </div>
      </Link>
    </div>
  )
}
