import { useEffect, useState } from "react"
import { FaRegArrowAltCircleDown } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import { DogCard } from "../components/DogCard"

export const Search = () => {

  const navigate = useNavigate()

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    fromDb: false,
    fromApi: false,
    sort: 'created_at',
    order: 'desc',
  })

  const [loading, setLoading] = useState(false)
  const [dogs, setDogs] = useState([])
  const [showMore, setShowMore] = useState(false)




  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermUrl = urlParams.get('searchTerm')
    const fromDbUrl = urlParams.get('fromDb')
    const fromApiUrl = urlParams.get('fromApi')
    const sortUrl = urlParams.get('sort')
    const orderUrl = urlParams.get('order')

    if (searchTermUrl || fromDbUrl || fromApiUrl || sortUrl || orderUrl) {
      setSidebarData({
        searchTerm: searchTermUrl || '',
        fromDb: fromDbUrl === 'true' ? true : false,
        fromApi: fromApiUrl === 'true' ? true : false,
        sort: sortUrl || 'created_at',
        order: orderUrl || 'desc',
      })
    }

    const fetchData = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/dog/get?${searchQuery}`)
      const data = await res.json()
      if (data.length > 0) {
        setShowMore(true)
      }else{
        setShowMore(false)
      }
      setDogs(data)
      setLoading(false)
    }

    fetchData()
  }, [location.search])

  const handleChange = (e) => {

    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value })
    }

    if (e.target.id === 'fromDb' || e.target.id === 'fromApi') {
      setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at'
      const order = e.target.value.split('_')[1] || 'desc'

      setSidebarData({ ...sidebarData, sort, order })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', sidebarData.searchTerm.trim())
    urlParams.set('fromDb', sidebarData.fromDb)
    urlParams.set('fromApi', sidebarData.fromApi)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('order', sidebarData.order)
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

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-slate-300 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-5">
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
            <label>Sort:</label>
            <select onChange={handleChange} defaultValue={'created_at_desc'} id='sort_order' className="border rounded-lg p-3">
              <option value='height_desc'>Height high to low</option>
              <option value='height_asc'>Height low to high</option>
              <option value='weight_desc'>Weight high to low</option>
              <option value='weight_asc'>Weight low to high</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-6 mt-7">Results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
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
