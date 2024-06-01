import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import dogRouter from './routes/dog.route.js'
import cookieParser from 'cookie-parser'
import temperamentRouter from './routes/temperament.route.js'
import path from 'path'

dotenv.config()

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((err) => {
    console.log(err)
  })

const __dirname = path.resolve()

const app = express()

app.use(express.json())

app.use(cookieParser())

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})


app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/dog', dogRouter)
app.use('/api/temperament', temperamentRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  return res.status(statusCode).json({success: false, statusCode, message})
})