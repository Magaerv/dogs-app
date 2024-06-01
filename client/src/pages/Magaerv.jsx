import { MdLocationOn } from "react-icons/md"
import { Link } from "react-router-dom"


export const Magaerv = () => {
  return (
    <div className="min-h-screen flex items-center justify-center my-10">
      <div className="bg-slate-200 w-full max-w-xl p-3">
        <p className="text-slate-600 mb-3 hover:underline">Who is Magaerv?</p>
        <p className="text-2xl text-slate-600 ">Hi! I´m</p>
        <div className="flex justify-between">
          <p className="text-3xl text-slate-700 font-bold uppercase">
            Mariela Ramirez Valle <br /><span className="capitalize font-normal text-2xl">FullStack Developer</span>
        </p>
          <img className='rounded-full flex justify-end bg-white border border-dashed  border-slate-500 size-1/4 hover:scale-105 transition-scale duration-300' src='https://firebasestorage.googleapis.com/v0/b/dogs-fe19a.appspot.com/o/photo.png?alt=media&token=1b322407-269e-4835-b5bb-87289e3bf13d' alt="" />
      </div>
          <div className="flex gap-2 mb-4 p-1">
            <MdLocationOn className="text-green-700 text-2xl" />
            <span className="text-slate-700 font-semibold text-lg">Córdoba, Argentina</span>
          </div>
          <div className="p-1 text-slate-700 gap-4">
            <p className="pb-2"><span className="font-bold">Email Address: </span><Link className="text-wrap" to={`mailto:magaerv.dev@gmail.com?subject=DogsLoversApp&body=Hi! I'm interested in your project.`}>magaerv.dev@gmail.com</Link></p>

          <p className="pb-2 text-wrap"><span className="font-bold">Linkedin: </span><Link className="text-wrap" to={`https://www.linkedin.com/in/mariela-ramirez-valle/`}>https://www.linkedin.com/in/magaerv/</Link></p>
            <p className="pb-2"><span className="font-bold">Github: </span><Link to={`https://github.com/Magaerv`}>https://github.com/Magaerv</Link></p>
            <br />
            <p className="pb-2 font-bold">Introducing DogsLovers App</p>
            <p><span className="font-semibold">DogsLovers App</span> is a modern and intuitive web application designed for dog enthusiasts to connect, share, and explore information about their favorite canine companions. Built with cutting-edge technologies including React, Redux Toolkit, Vite, Express, MongoDB, and Firebase, DogsLovers App offers a seamless user experience with robust features and functionalities.</p>
            <br/>
            <p className="pb-2 font-bold">Key Features:</p>
            <p><span className="font-bold">1. User Authentication with Firebase:</span> Users can easily sign in to DogsLovers App using their Google accounts, ensuring a secure and hassle-free login experience.</p>
            <p><span className="font-bold">2. Interactive User Interface:</span> With React at its core, DogsLovers App boasts a sleek and responsive user interface, allowing users to navigate effortlessly and discover content with ease.</p>
            <p><span className="font-bold">3. Real-time Data Management with Redux Toolkit:</span> Redux Toolkit powers the state management in DogsLovers App, enabling real-time updates and seamless synchronization of data across the application.</p>
            <p><span className="font-bold">4. Fast Development with Vite:</span> Leveraging the power of Vite, DogsLovers App offers lightning-fast development and bundling, ensuring quick load times and optimal performance.</p>
            <p><span className="font-bold">5. Backend with Express and MongoDB:</span> The backend of DogsLovers App is powered by Express and MongoDB, providing a robust and scalable infrastructure for storing and managing data efficiently.</p>
            <p><span className="font-bold">6. Image Storage with Firebase:</span> Images uploaded by users are securely stored and managed using Firebase Storage, ensuring reliability and accessibility of media content.</p>
            <br />
          </div>
        </div>
      </div>
  )
}
