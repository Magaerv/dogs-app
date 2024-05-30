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
  const [dogTemp1, setDogTemp1] = useState([])
  const [dogTemp2, setDogTemp2] = useState([])

  const { currentUser } = useSelector(state => state.user)


  useEffect(() => {
    const fetchLastDogs = async () => {
      try {
        const res = await fetch('/api/dog/get?fromDb=true&limit=6')
        const data = await res.json()
        setLastDogs(data)
        fetchPowerfulTemp()
        fetchQuietTemp()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchPowerfulTemp = async () => {
      try {
        const res = await fetch('/api/dog/get?temperament=powerful&limit=3')
        const data = await res.json()
        setDogTemp1(data)
      } catch (error) {
        console.log(error)
      }
    }
    const fetchQuietTemp = async () => {
      try {
        const res = await fetch('/api/dog/get?temperament=quiet&limit=3')
        const data = await res.json()
        setDogTemp2(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchLastDogs()
  }, [])

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl p-3'>The DOGSLOVERS<span className='text-slate-500'>App</span>
        </h1>
        <div className="text-slate-600 text-sm sm:text-lg p-3 space-y-3">
          <p>Welcome to our <span className='text-slate-700 font-semibold'>Dog Lovers App</span>, the ultimate platform for sharing and discovering everything about dogs! Our application utilizes the powerful TheDogAPI.com to provide you with a vast database of dog breeds, complete with photos and detailed information.</p>
          <p>But that´s not all! You can also contribute to our community by uploading information about your own pet dogs. Share photos, add descriptions, and showcase your furry friends to dog lovers everywhere. Additionally, you have full control over your posts, allowing you to edit and delete the information as needed. </p>
          <p>Join our vibrant community where every dog has a story to tell, and every user can discover new canine friends. Whether you´re looking to learn more about different breeds or eager to share your own pet´s unique charm, our app is the perfect place for all dog enthusiasts.</p>
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
          dogTemp1 && dogTemp1.length > 0 && (
            <div className=''>
              <div className=''>
                <h2 className='text-2xl font-semibold text-slate-500 p-3'>
                  Powerful Dogs:
                </h2>
                { /* <Link to={'/search?searchTerm=loving'}>Show more</Link> */
                }
              </div>
              <div className='flex flex-wrap gap-5 p-3'>
                {dogTemp1.map((dog) => (
                  <DogCard dog={dog} key={dog.id || dog._id} />
                ))}
              </div>
            </div>
          )
        }
        {
          dogTemp2 && dogTemp2.length > 0 && (
            <div className=''>
              <div className=''>
                <h2 className='text-2xl font-semibold text-slate-500 p-3'>
                  Quiet Dogs:
                </h2>
                { /* <Link to={'/search?searchTerm=loving'}>Show more</Link> */
                }
              </div>
              <div className='flex flex-wrap gap-5 p-3'>
                {dogTemp2.map((dog) => (
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
          dogTemp && dogTemp.length > 0 &&
          dogTemp.map((dog) => (
            <SwiperSlide key={dog._id || dog.id}>
              <div style={{ background: `url(${dog.image.url}) center no-repeat`, backgroundSize: 'cover' }} className='h-[500px]'></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
*/