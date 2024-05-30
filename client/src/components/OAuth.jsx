import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import {app} from '../firebase.js';
import { useDispatch } from 'react-redux'; 
import { signInFailure, signInSuccess } from '../redux/user/userSlice.js'
import {useNavigate} from 'react-router-dom'

export const OAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  // sign in with google

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)
     
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      });

      const data = await res.json()
      dispatch(signInSuccess(data))
      navigate('/search')
    } catch (error) {
      dispatch(signInFailure(error.message))
      console.log('could not sign in with Google', error)
    }
  }


  return (
    <button
      type='button'
      className="bg-blue-800 text-white p-3 rounded-lg uppercase hover:opacity-95"
      onClick={handleGoogleClick}
    >Continue with Google</button>
  )
}
