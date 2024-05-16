import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useState } from "react"
import { useSelector } from 'react-redux'
import { app } from "../firebase"
import {useNavigate} from 'react-router-dom'

export const CreateDog = () => {

  const { currentUser } = useSelector(state => state.user)
   const navigate = useNavigate()

  const [files, setFiles] = useState([])
  const [formData, setFormData] = useState({
    image: [],
    name: '',
    height: '',
    weight: '',
    life_span: '',
    origin: ''
  })


  const [imageError, setImageError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.image.length < 4) {
      setUploading(true)
      setImageError(false)
      const promises = []

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }

      Promise.all(promises).then((urls) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: [...prevFormData.image, ...urls]
        }))
        setImageError(false)
        setUploading(false)
      }).catch(error => {
        setImageError("Image upload failed")
        throw new Error({ error: error.message })
      })
    } else {
      setImageError('You can only upload 3 images per dog')
      setUploading(false)
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${(Math.round(progress))}% done.`)
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.image.length < 1) return setError('You must upload at least 1 image')
      setLoading(true)
      setError(false)
      const res = await fetch('/api/dog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })
      const data = await res.json()
      setLoading(false)
      if (data.success === false) {
        setError(data.message)
      }
      navigate(`/dog/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }


  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-9">Create a new Dog</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-5 flex-1">
          <input type="text" placeholder="Name" className="border p-3 rounded-lg" id='name' maxLength='62' minLength='3' required onChange={handleChange} value={formData.name} />
          <input type="text" placeholder="Height" className="border p-3 rounded-lg" id='height' maxLength='62' required onChange={handleChange} value={formData.height} />
          <input type="text" placeholder="Weight" className="border p-3 rounded-lg" id='weight' maxLength='62' required onChange={handleChange} value={formData.weight} />
          <input type="text" placeholder="Life span" className="border p-3 rounded-lg" id='life_span' maxLength='62' required onChange={handleChange} value={formData.life_span} />
          <input type="text" placeholder="Origin" className="border p-3 rounded-lg" id='origin' maxLength='62' required onChange={handleChange} value={formData.origin} />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold text-slate-600 ml-3">Images:
            <span className="font-normal text-slate-500 ml-2">The first image will be the cover (max 3)</span>
          </p>
          <div className="flex gap-4">
            <input onChange={(e) => setFiles(e.target.files)} className="p-2 text-slate-500 rounded w-full" type="file" id='images' accept="image/*" multiple />
            <button type="button" onClick={handleImageSubmit} className="text-slate-600 border border-slate-600 px-2 my-1 rounded-md uppercase hover:shadow-lg hover:text-slate-800 disabled:opacity-80">
              {
                uploading ? 'Uploading...' : 'Upload'
              }
            </button>
          </div>
          <p className="text-red-500 text-sm">{imageError && imageError}</p>
          {
            formData.image.length > 0 && formData.image.map((url) => {
              return (
                <div key={url} className="flex justify-between p-3 border items-center">
                  <img src={url} alt="dog image" className="w-20 h-20 object-contain rounded-lg" />
                  <button className="p-3 text-red-500 rounded-lg uppercase hover:opacity-80">Delete</button>
                </div>
              )
            })
          }
          <button disabled={loading || uploading} className="bg-slate-600 max-w-full text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 my-5">
            {
              loading ? 'Loading...' : 'Create Dog'
            }
          </button>
          {
            error && <p className='text-red-500 text-sm'>{error}</p>
          }
        </div>

      </form>

    </main>
  )
}
