const {User, Krypt, Comment, Dekrypt, Lock} = require('../models/Schemas')
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({id}, 'netninjasecret', {
        expiresIn: maxAge
    })

}

module.exports.signup_post = async (req,res) =>{
    const {userData} = req.body;
    console.log(userData);
    
    try {
        const user = await User.create({email: userData.email, username: userData.username, password: userData.password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.json({
            status: 'success',
            user : user
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: 'error',
        })
    }

}

module.exports.login_post = async (req, res) =>{
    const {signinData} = req.body;
    const { email, password} = signinData


    try {
        const user = await User.login( email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.json({
            status: 'success',
            user: user
        })
        
    } catch (error) {
      res.json({
          status: 'failure',
      })
    }
}

module.exports.home_get =  async (req,res) =>{
    try {
       const Tweetdata = await Krypt.find({});
       res.json({
           status: 'success',
           data: Tweetdata,
           message: 'Data gotten'
   
       })     
    } catch (error) {
        
    }
}

module.exports.krypt_get =  async (req,res) =>{
    const {id} = req.params;
    try {
        console.log(id);
       const singleKrypt = await Krypt.findById(id).populate('creator');
       console.log(singleKrypt.creator.email);
       res.json({
           status: 'success',
           data: singleKrypt,
           message: 'Data gotten'
       })     
    } catch (error) {
        res.json({
            status: 'failure'
        })  
    }
   
}

module.exports.create_post = async (req, res) => {
    const {finalData} = req.body
    const token = req.cookies.jwt;
    console.log(finalData);
    try{
        jwt.verify(token, 'netninjasecret', async (err, decodedToken) => {
            if (err){
                console.log(err.message);
                res.json({
                    status: "failure"
                })
            } else {
                const loggeduser = await User.findById(decodedToken.id);
                const user_id = loggeduser._id;
                console.log(user_id);
                const newkrypt = await Krypt.create({title: finalData.title, content: finalData.content, creator:user_id, date: finalData.date, time: finalData.time})
                console.log(newkrypt)
                res.json({
                    status: 'success',
                    newkrypt: newkrypt, 
                });
                   
            }       
    })
    }
    catch (error) {
        res.json({
            status: 'failure'
        })  
    }
}

module.exports.quiz_post = async (req, res) => {
    const {id} = req.params;
    const {questionBox} = req.body;
    
    try {
     const newLock = await Lock.create({krypt :id, authenticate:questionBox})
     res.json({
         status: 'success',
         newLock: newLock
     })
     
 } catch (error) {
   console.log(error)  
 }

}

module.exports.passcode_post = async (req, res) => {
    const {id} = req.params;
    const {finalCell} = req.body;
    try {
     const newLock = await Lock.create({krypt :id, authenticate:finalCell})
     res.json({
         status: 'success',
         newLock: newLock
     })
     
 } catch (error) {
   console.log(error)  
 }

}

module.exports.choice_post = async (req, res) => {
    const {id} = req.params;
    const {multibox} = req.body;
    console.log(multibox);
    try {
     const newLock = await Lock.create({krypt :id, authenticate:multibox})
     res.json({
         status: 'success',
         newLock: newLock
     })
     
 } catch (error) {
   console.log(error)  
 }

}

module.exports.setlock_post = async (req, res) => {
    const {finalValue} = req.body
     const {id} = req.params;
     console.log(finalValue)
     try {
         const updateKrypt = await Krypt.findByIdAndUpdate(id, {type : finalValue})
         const lockKrypt = await Krypt.findById(id)
         console.log(lockKrypt);
         res.json({
             status : 'success',
             lockkrypt : lockKrypt
                  })
     } catch (error) {
         console.log(error)
     }
 }