import { useEffect, useState } from "react"
import { FaRegArrowAltCircleDown } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from 'react-router-dom'
import { DogCard } from "../components/DogCard"

export const Search = () => {

  const navigate = useNavigate()
  const location = useLocation();

  const {currentUser} = useSelector(state => state.user)

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    fromDb: false,
    fromApi: false,
    sort_order: 'name_asc',
    temperament: ''
  })


  const [loading, setLoading] = useState(false)
  const [dogs, setDogs] = useState([])
  const [showMore, setShowMore] = useState(false)
  const [temperaments, setTemperaments] = useState([])


  useEffect(() => {
    const getTemperaments = async () => {
      const tempData = await fetch('/api/temperament/all')
      const data = await tempData.json()
      setTemperaments(data)
    }
    getTemperaments()
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermUrl = urlParams.get('searchTerm')
    const fromDbUrl = urlParams.get('fromDb')
    const fromApiUrl = urlParams.get('fromApi')
    const sort_orderUrl = urlParams.get('sort_order')
    const temperamentUrl = urlParams.get('temperament')


    if (searchTermUrl || fromDbUrl || fromApiUrl || sort_orderUrl || temperamentUrl) {
      setSidebarData({
        searchTerm: searchTermUrl || '',
        fromDb: fromDbUrl === 'true' ? true : false,
        fromApi: fromApiUrl === 'true' ? true : false,
        sort_order: sort_orderUrl || 'name_asc',
        temperament: temperamentUrl || ''
      })
    }

    const fetchData = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/dog/get?${searchQuery}`)
      const data = await res.json()

      if (data.length > 0) {
         setShowMore(data.length === 30)
      } else {
        setShowMore(false)
      }

      setLoading(false)
      setDogs(data)
    }
    fetchData()
  }, [location.search])

  const handleChange = (e) => {
    const { id, value, checked } = e.target


    if (id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: value })
    } else if (id === 'temperament') {
      setSidebarData({ ...sidebarData, temperament: value })
    } else if (id === 'fromDb' || id === 'fromApi') {
      setSidebarData({ ...sidebarData, [id]: checked })
    } else if (id === 'sort_order') {
      setSidebarData({ ...sidebarData, sort_order: value })
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', sidebarData.searchTerm.trim())
    urlParams.set('fromDb', sidebarData.fromDb)
    urlParams.set('fromApi', sidebarData.fromApi)
    urlParams.set('sort_order', sidebarData.sort_order)
    urlParams.set('temperament', sidebarData.temperament)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
    setLoading(false)
  }

  const handleShowMore = async () => {
    const numberOfDogs = dogs.length
    const startIndex = numberOfDogs
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString()
    const res = await fetch(`/api/dog/get?${searchQuery}`)
    const data = await res.json()
    if (data.length < 30) {
      setShowMore(false)
    }
    setDogs([...dogs, ...data])
  }


  const handleClear = () => {
    setSidebarData({
      searchTerm: '',
      fromDb: false,
      fromApi: false,
      sort_order: 'name_asc',
      temperament: ''
    })
    navigate('/search')
  }

  const handleCreate = () => {
    if (currentUser?._id) {
      navigate('/create-dog')
     }else{
      navigate('/sign-in')
     }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 border-slate-300 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-5">
          <div className="flex items-center gap-2 text-slate-700">
            <label className="whitespace-nowrap">Search Term:</label>
            <input type='text' id='searchTerm' placeholder="Search..." className="border rounded-lg p-3 w-full bg-slate-100 focus: outline-none"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">

            <div className="flex gap-2 text-slate-700">
              <input type='checkbox' id='fromDb' className="w-5"
                checked={sidebarData.fromDb}
                onChange={handleChange}
              />
              <span>From Database</span>
            </div>
            <div className="flex gap-2 text-slate-700">
              <input type='checkbox' id='fromApi'
                className="w-5"
                checked={sidebarData.fromApi}
                onChange={handleChange}
              />
              <span>From API</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <label>Temperament:</label>
            <select onChange={handleChange} id='temperament' className="border rounded-lg p-3" value={sidebarData.temperament}>
              <option value={'All'}>All</option>
              {temperaments.map(temp => (
                <option key={temp._id} value={temp.name}>{temp.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <label>Order by:</label>
            <select onChange={handleChange} id='sort_order' className="border rounded-lg p-3" value={sidebarData.sort_order} >
              <option value='name_asc'>A to Z</option>
              <option value='name_desc'>Z to A</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
          <button onClick={handleClear} className="bg-slate-400 text-white p-3 rounded-lg uppercase hover:opacity-95">Clear</button>
          <button onClick={handleCreate} className="bg-green-800 text-white p-3 rounded-lg uppercase hover:opacity-95 my-7 flex justify-center items-center">Post your Dog</button>
        </form>
       
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-6 mt-7">Results:</h1>
        <div className="p-3 flex flex-wrap gap-3">
          {
            !loading && dogs.length === undefined &&
            <p className="text-xl text-slate-700">
              No dogs found!</p>
          }

          {
            loading && (
              <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
            )
          }
          {!loading && dogs.length > 0 && dogs.map((dog) => (
            <DogCard key={dog._id || dog.id} dog={dog} />
          ))}

        </div>
        <div className="flex flex-1 items-center justify-center">
          {!loading && showMore &&
            <button
              onClick={handleShowMore}
              className="rounded-lg p-3 mx-5 hover:text-slate-700 font-semibold text-slate-500 bg-slate-300"
            > <span className='inline-flex '><FaRegArrowAltCircleDown /></span> Show more
            </button>
          }
        </div>
      </div>
    </div>
  )
}
