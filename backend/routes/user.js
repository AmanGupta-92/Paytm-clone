import {express} from 'express'
import mongoose from 'mongoose'
import {string, z} from 'zod'
const { User } = require('../db')
const { jwt } = require('jsonwebtoken') 
const { JWT_SECRET } = require("../config")
const authMiddleware = require('../middleware')

const router = express.Router();

const signupBody = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

router.post('/signup', async (req, res) => {
    //zod validation
    const { success } = signupBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "Email already taken/ incorrect inputs"
        })
    }

    //check if user is existing in database
    const existingUser = await User.findone({
        username: req.body.username
    })

    if(existingUser){
        res.status(411).json({
            message: "Email already taken/ incorrect inputs"
        })
    }

    //create new user schema
    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })

    const userId = user._id;

    //create jwt token for new user with secret saved
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created suscessfully",
        token: token
    })
})

//
const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string.optional()
})

router.put('/', authMiddleware, async (req, res) => {

    const success = updateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Error while udpating information"
        })
    }

    try {
        await User.updateOne({ _id: req.userId }, req.body);
        
        res.status(200).json({
            message: "updated successfully"
        })        
    } catch (error) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
})


const signinBody = z.object({
    username: z.string(),
    password: z.string()
})

router.post('/signin', authMiddleware, async (req, res) => {

    const success = signinBody.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            message: "Incorrect Inputs"
        })
    }

    const user = await User.findone({
        username: req.body.username,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        res.json({
            token: token
        })

        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

router.get('/bulk', async  (req, res) => {

    const filter = req.query.filter || ""; 

    const users = await User.find({
        $or: [{firstName: {
            "$regex": filter
        }},{
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;