import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true 
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },  
        avatar: {
            type: String,
            required: true,
        },
        post:[
            {
                type: Schema.Types.ObjectId,
                ref:'Post'
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },{
        timestamps:true
    }
)

userSchema.pre('save', async function(next) {
    if (this.isModified("password")) {
        console.log('Hashing password:', this.password);
        this.password = await bcrypt.hash(this.password, 10);
        console.log('Hashed password:', this.password);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    console.log('Comparing passwords:', password, this.password);
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
    },
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }        
    )   
}

userSchema.methods.genreateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        } 
    )
}

export const User = mongoose.model("User", userSchema)