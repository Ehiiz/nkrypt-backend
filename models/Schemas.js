const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true, 
        lowercase: true,
    },
     username:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: true, 
        lowercase: true,
            },
    password:{
        type:String,
         required:true},
        image:{type:String}
})


//password hashing function before document is saved
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//fucntion to log in detail after user is saved to db
userSchema.post('save', function(doc, next){
    console.log(doc + " this is the newly saved user details")
    next();
})

//static method to log in userSchema
userSchema.statics.login = async function(email, password) {
   const user = await this.findOne({email});
   if(user){
       const auth = await bcrypt.compare(password, user.password);
       if(auth){
           return user
       } throw Error ('Incorrect password')
   } throw Error ('Incorrect email')
}



const kryptSchema = new Schema({
    title:{type:String, required:true},
    content:{type:Object, required:true},
    success:{type:String},
    failure:{type:String},
    comment:{type:String},
    creator:{type:Schema.Types.ObjectId, ref:'user'},
    type:{type:String},
    time:{type:String},
    date:{type:String}
})

const questionSchema = new Schema({
    question: {type:String},
    option1:{type:String},
    option2:{type:String},
    option3:{type:String},
    option4:{type:String},
    answer:{type:String}
})

//answer hashing function before being saved
questionSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt();
    this.answer = await bcrypt.hash(this.answer, salt);
    next();
})


const lockSchema = new Schema({
    krypt:{type:Schema.Types.ObjectId, ref:'krypt'},
    authenticate:[questionSchema]
})


const commentSchema = new Schema({
    usercomment:{type:Array, required:true},
    krypt:{type:Schema.Types.ObjectId, ref:'krypt'},
})

const dekryptSchema = new Schema({
    krypt:{type:Schema.Types.ObjectId, ref:'krypt'},
    dekrypter:{type:Schema.Types.ObjectId, ref:'user'},
})

const User = mongoose.model("user", userSchema, 'user');
const Krypt = mongoose.model("krypt", kryptSchema, 'krypt');
const Comment = mongoose.model("comment", commentSchema, 'comment');
const Dekrypt = mongoose.model("dekrypt", dekryptSchema, 'dekrypt');
const Lock = mongoose.model("lock", lockSchema, 'lock');


module.exports = {User, Krypt, Comment, Dekrypt, Lock}

