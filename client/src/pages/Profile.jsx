import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from 'react-router-dom'
import { app } from "../firebase"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";


export default function Profile() {

  const fileRef = useRef(null)

  const { currentUser, loading, error } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined)
  const [fileUploading, setFileUploading] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showDogsError, setShowDogsError] = useState(false)
  const [userDogs, setUserDogs] = useState([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])


  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFileUploading(Math.round(progress))
      },
      (error) => {
        console.log('Error uploading file:', error)
        setFileError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downLoadURL) => {
            setFormData({ ...formData, avatar: downLoadURL })
          }
          )
      }
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      setUpdateSuccess(false)
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })


      const data = await res.json()

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setFileUploading(0)
      setUpdateSuccess(true)

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
      navigate('/sign-in')
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleLogout = async () => {
    try {
      dispatch(signOutStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutFailure(data.message))
        return
      }
      dispatch(signOutSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }

  const handleShowDog = async () => {
    try {
      setShowDogsError(false)
      const res = await fetch(`/api/user/dogs/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setShowDogsError(true)
        return
      }
      setUserDogs(data)
    } catch (error) {
      setShowDogsError(true)
    }
  }

  const handleDeleteDog = async (dogId) => {
    try {
      const res = await fetch(`/api/dog/delete/${dogId}`, {
        method: "DELETE"
      })
      const data = await res.json()
      if (data.success === false) {
        console.log(data.message)
        return
      }
      setUserDogs((prev)=> prev.filter((dog)=> dog._id !== dogId))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto my-auto">
      <h1 className="text-3xl font-semibold text-center my-7">My Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <div className="relative self-center mt-2 cursor-pointer" onClick={() => fileRef.current.click()}>
          <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 opacity-90' src={formData.avatar || currentUser?.avatar} alt='' />
          <span className='absolute bottom-0 right-0 text-2xl text-slate-200 bg-slate-400 rounded-full p-1 text-lg'>
            <MdAddAPhoto />
          </span>
        </div>
          <p className='text-sm self-center'>
         <span className='text-slate-500 font-semibold flex-col flex justify-center text-2xl text-center'>{formData.username || currentUser?.username}</span>
          {fileError ? (
            <span className='text-red-500'>Error image upload (Image must be less than 2 mb)</span>
          ) : fileUploading > 0 && fileUploading < 100 ? (
            <span className='text-slate-700'>{`Uploading ${fileUploading}%`}</span>
          ) : fileUploading === 100 ? (
            <span className='text-green-800'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <p className='text-slate-600 text-center mt-3'>- You can update your info here -</p>
        <input type="text"
          placeholder="username" id='username' className="border p-3 rounded-lg mt-5 text-slate-600" value={formData.username || currentUser?.username}
          onChange={handleChange}
          autoComplete="off" />
        <input type="text" placeholder="email" id='email' className="border p-3 rounded-lg mt-7 text-slate-600" value={formData.email || currentUser?.email} onChange={handleChange}
          autoComplete="off" />
        <input type="password" placeholder="password" id='password' className="border p-3 rounded-lg mt-7 text-slate-600" value={formData.password || currentUser?.password}
          onChange={handleChange}
          autoComplete="off" />
        <button disabled={loading} className="bg-slate-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70">{loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-800 text-white p-3 rounded-lg uppercase text-center hover:opacity-90' to={'/create-dog'}>Post your dog</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500 cursor-pointer hover:underline' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-500 cursor-pointer hover:underline' onClick={handleLogout}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-800 my-5 flex flex-col justify-center text-center'>{updateSuccess ? 'User updated successfully!' : ''}</p>
        <button onClick={handleShowDog} className="w-full rounded-lg p-2 hover:text-slate-700 font-semibold text-slate-500 bg-slate-300"><span className='inline-flex '><FaRegArrowAltCircleDown /></span> Show my dogs</button>
      <p className='text-red-500 mt-5'>{showDogsError ? 'Error showing dogs' : ''}</p>
      {
        userDogs &&
        userDogs.length > 0 &&
        <div className='flex flex-col gap-4 justify-between'>
            <h1 className='text-center mt-7 text-2xl font-semibold'>Your Dogs</h1>
          {userDogs?.map((dog) => {
            return (
              <div key={dog._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                <Link to={`/dog/${dog._id}`}>
                  <img src={dog.image[0]} alt='dog image cover' className='h-14 w-13 object-contain' />
                </Link>
                <Link className='text-slate-600 font-semibold flex-1 hover:underline truncate' to={`/dog/${dog._id}`}>
                  <p className='font-bold'>{dog.name}</p>
                </Link>
                <div className='flex flex-col items-center'>
                  <button
                    onClick={() => handleDeleteDog(dog._id)} className='text-red-600 uppercase'>Delete</button>
                  <Link to={`/update-dog/${dog._id}` }>
                  <button className='text-green-700 uppercase'>Edit</button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      }
      {
        !userDogs && userDogs.length === 0 && <p className='text-slate-600 text-center mt-3'>You haven`t posted about your pet yet</p>
      }
    </div>
  )
}
