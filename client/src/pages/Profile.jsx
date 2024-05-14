import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { app } from "../firebase"

export default function Profile() {

  const fileRef = useRef(null)

  const { currentUser } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined)
  const [fileUploading, setFileUploading] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState({})
  console.log(fileError)
  console.log(fileUploading)
  console.log("formData", formData)

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
        setFileUploading(Math.floor(progress))
      },
      (error) => {
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">My Account</h1>
      <form className="flex flex-col gap-3">
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 opacity-90' src={formData.avatar || currentUser?.avatar || currentUser?.rest.avatar} alt='' />
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
        <input type="text" placeholder="username" id='username' className="border p-3 rounded-lg mt-7" />
        <input type="text" placeholder="email" id='email' className="border p-3 rounded-lg mt-7" />
        <input type="text" placeholder="password" id='password' className="border p-3 rounded-lg mt-7" />
        <button className="bg-slate-600 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70">Update
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500'>Delete Account</span>
        <span className='text-red-500'>Sign Out</span>
      </div>
    </div>
  )
}
