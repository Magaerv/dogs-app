import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'


export const Search = () => {

  const navigate = useNavigate()

  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    fromDb: false,
    fromApi: false,
    sort: 'created_at',
    order: 'desc',
  })
  console.log(sidebarData)


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermUrl = urlParams.get('searchTerm')
    const fromDbUrl = urlParams.get('fromDb')
    const fromApiUrl = urlParams.get('fromApi')
    const sortUrl = urlParams.get('sort')
    const orderUrl = urlParams.get('order')

    console.log("searchTermUrl", searchTermUrl)
    if (searchTermUrl || fromDbUrl || fromApiUrl || sortUrl, orderUrl) {
      setSidebarData({
        searchTerm: searchTermUrl || '',
        fromDb: fromDbUrl === 'true' ? true : false,
        fromApi: fromApiUrl === 'true' ? true : false,
        sort: sortUrl || 'created_at',
        order: orderUrl || 'desc',
      })
    }
  }, [location.search ])

  const handleChange = (e) => {

    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value })
    }

    if (e.target.id === 'fromDb' || e.target.id === 'fromApi') {
      setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at'
      const order = e.target.value.split('_')[1] || 'desc'

      setSidebarData({ ...sidebarData, sort, order })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('fromDb', sidebarData.fromDb)
    urlParams.set('fromApi', sidebarData.fromApi)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('order', sidebarData.order)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
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
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 mt-7">Dog List</h1>
      </div>
    </div>
  )
}
