import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from 'react-router-dom'
import { app } from "../firebase"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'


export default function Profile() {

  const fileRef = useRef(null)

  const { currentUser, loading, error } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined)
  const [fileUploading, setFileUploading] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)

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
      navigate('/sign-in')
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }

  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">My Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 opacity-90' src={formData.avatar || currentUser?.avatar} alt='' />
        <p className='text-sm self-center'>
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
        <input type="text"
          placeholder="username" id='username' className="border p-3 rounded-lg mt-7" value={formData.username || currentUser?.username}
          onChange={handleChange}
          autoComplete="off" />
        <input type="text" placeholder="email" id='email' className="border p-3 rounded-lg mt-7" value={formData.email || currentUser?.email} onChange={handleChange}
          autoComplete="off" />
        <input type="password" placeholder="password" id='password' className="border p-3 rounded-lg mt-7" value={formData.password || currentUser?.password}
          onChange={handleChange}
          autoComplete="off" />
        <button disabled={loading} className="bg-slate-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70">{loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-800 text-white p-3 rounded-lg uppercase text-center hover:opacity-90' to={'/create-dog'}>Create New Dog</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500 cursor-pointer' onClick={handleDeleteUser}>Delete Account</span>
        <span className='text-red-500 cursor-pointer' onClick={handleLogout}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-800 mt-5'>{updateSuccess ? 'User is updated successfully' : ''}</p>
    </div>
  )
}
