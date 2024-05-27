import express from 'express'
import { test, updateUser, deleteUser, getUserDogs, getUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const userRouter = express.Router()

userRouter.get('/test', test)
userRouter.post('/update/:id',verifyToken, updateUser)
userRouter.delete('/delete/:id', verifyToken, deleteUser)
userRouter.get('/dogs/:id', verifyToken, getUserDogs)
userRouter.get('/:id', verifyToken, getUser)

export default userRouter