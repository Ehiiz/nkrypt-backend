const { Router } = require('express');
const jwt = require('jsonwebtoken');
const {User, Krypt, Comment, Dekrypt, Lock} = require('../models/Schemas')
const authController = require('../controllers/authController');
const { requireAuth, checkUser } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/signup', authController.signup_post);

router.post('/signin', authController.login_post)

router.get('/settings', requireAuth, async (req,res) => {
   const token = req.cookies.jwt;
    try {
        jwt.verify(token, 'netninjasecret', async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.json({
                    status: "failure"
                })
            } else {
                let user = await User.findById(decodedToken.id);
                console.log(user)
            }
           
        })
    const kryptdata = await Krypt.find({})
    res.json({
        status: 'success',
        data: kryptdata
    });
       
   } catch (error) {
     res.json({
         status: 'failure'
     })
       
   }
  
})

 
router.get('/home', authController.home_get)

router.get('/krypt/:id', requireAuth, authController.krypt_get)

router.get('/profile', requireAuth, async (req,res)=>{
    const {id} = req.params;
    const token = req.cookies.jwt;
    try {
    jwt.verify(token, 'netninjasecret', async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.json({
                    status: "failure"
                })
            } else {
                const loggeduser = await User.findById(decodedToken.id);
                const kryptdata = await Krypt.find({})
                res.json({
                    status: 'success',
                    kryptdata: kryptdata, 
                    loggeduser: loggeduser
                });
                   
            }       
    })
   } catch (error) {
        res.json({
            status: 'failure'
        })  
    }  
})

router.post('/create', authController.create_post)
 
router.post('/setlock/:id', authController.setlock_post)

router.post('/passcode/:id', authController.passcode_post)

router.post('/quiz/:id', authController.quiz_post)

router.post('/choice/:id', authController.choice_post)

router.get('/p-unlock/:id', async (req, res) => {
    const {id} = req.params
    try {
        const lockDeets = await Lock.findOne({krypt : id});
        const kryptDeets = await Krypt.findById(id);
        res.json({
            data : {lockDeets, kryptDeets},
            status : 'success'
        })
        
        
    } catch (error) {
        res.json({
            status: 'failure'
        })
    }

})

router.get('/m-unlock/:id', async (req, res) => {
    const {id} = req.params
    try {
        const lockDeets = await Lock.findOne({krypt : id});
        const kryptDeets = await Krypt.findById(id);
        res.json({
            data : {lockDeets, kryptDeets},
            status : 'success'
        })
        
        
    } catch (error) {
        res.json({
            status: 'failure'
        })
    }

})

router.get('/q-unlock/:id', async (req, res) => {
    const {id} = req.params
    try {
        const lockDeets = await Lock.findOne({krypt : id});
        const kryptDeets = await Krypt.findById(id).populate('creator');
        res.json({
            data : {lockDeets, kryptDeets},
            status : 'success'
        })
        
        
    } catch (error) {
        res.json({
            status: 'failure'
        })
    }

})
module.exports = router;