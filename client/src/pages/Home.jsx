import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
//import { Swiper, SwiperSlide } from 'swiper/react'
//import { Navigation } from 'swiper/modules'
import { useSelector } from 'react-redux'
import { DogCard } from '../components/DogCard'


export default function Home() {
  const [lastDogs, setLastDogs] = useState([])
  const [lovingTemp, setLovingTemp] = useState([])

  const { currentUser } = useSelector(state => state.user)


  useEffect(() => {
    const fetchLastDogs = async () => {
      try {
        const res = await fetch('/api/dog/get?fromDb=true&limit=3')
        const data = await res.json()
        setLastDogs(data)
        fetchLovingTemp()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchLovingTemp = async () => {
      try {
        const res = await fetch('/api/dog/get/temperament/loving')
        const data = await res.json()
        setLovingTemp([data[0], data[1], data[2]])
      } catch (error) {
        console.log(error)
      }
    }
    fetchLastDogs()
  }, [])

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl p-3'>Titulo para cortar <span className='text-slate-500'>perfectamente</span>
          <br />
          bajando a la segunda linea</h1>
        <div className="text-slate-500 text-sm sm:text-lg p-3">
          Acá pone texto largo vaya a saber para qué si no es para agregar mucha información.
          <br />
          Tenemos muchas opciones para que elijas y te entretengas.
        </div>
        <div className='flex flex-row justify-center'>
          <Link to={'/search'} className='bg-slate-300 rounded-lg m-3 p-2 gap-2 my-6 first-line:text-xl sm:text-lg text-slate-600 font-bold hover:underline'>
          {` Let's get started!`}
        </Link>
          {currentUser?._id ? (
            <Link to={'/create-dog'} className='bg-slate-300 rounded-lg m-3 p-2 gap-2 my-6 first-line:text-xl sm:text-lg text-slate-600 font-bold hover:underline'>Post your Dog</Link>
          ) :
            ('')
          }
        </div>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-3 my-3'>
        {
          lastDogs && lastDogs.length > 0 && (
            <div className=''>
              <div className=''>
                <h2 className='text-2xl font-semibold text-slate-500 p-3'>
                  Recent Dogs:
                </h2>
                { /* <Link to={'/search?searchTerm=loving'}>Show more</Link> */
                }
              </div>
              <div className='flex flex-wrap gap-5 p-3'>
                {lastDogs.map((dog) => (
                  <DogCard dog={dog} key={dog.id || dog._id} />
                ))}
              </div>
            </div>
          )
        }
        {
          lovingTemp && lovingTemp.length > 0 && (
            <div className=''>
              <div className=''>
                <h2 className='text-2xl font-semibold text-slate-500 p-3'>
                  Most Loving Dogs:
                </h2>
                { /* <Link to={'/search?searchTerm=loving'}>Show more</Link> */
                }
              </div>
              <div className='flex flex-wrap gap-5 p-3'>
                {lovingTemp.map((dog) => (
                  <DogCard dog={dog} key={dog.id || dog._id} />
                ))}
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}




/*
<Swiper modules={[Navigation]} navigation spaceBetween={0}
        slidesPerView={1}>
        {
          lovingTemp && lovingTemp.length > 0 &&
          lovingTemp.map((dog) => (
            <SwiperSlide key={dog._id || dog.id}>
              <div style={{ background: `url(${dog.image.url}) center no-repeat`, backgroundSize: 'fill' }} className='h-[500px]'></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      <Swiper modules={[Navigation]} navigation spaceBetween={0}
        slidesPerView={1}>
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          lastDogs && lastDogs.length > 0 &&
            lastDogs.map((dog) => (
            <SwiperSlide key={dog._id }>
              <div style={{ background: `url(${dog.image.map(img => img)}) center no-repeat`, backgroundSize: 'cover' }} className='h-[500px]'>
              </div>
                </SwiperSlide>
          ))
          }
        </div>
      </Swiper>
      <Swiper modules={[Navigation]} navigation spaceBetween={0}
        slidesPerView={1}>
        {
          lovingTemp && lovingTemp.length > 0 &&
          lovingTemp.map((dog) => (
            <SwiperSlide key={dog._id || dog.id}>
              <div style={{ background: `url(${dog.image.url}) center no-repeat`, backgroundSize: 'cover' }} className='h-[500px]'></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
*/