import mongoose, {Schema} from 'mongoose'

const postSchema = new Schema({
    image:{
        type:String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        trim:true
    },
    comment:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likeCount: {
        type: Number,
        default: 0
    }

},{timestamps:true})



export const Post = mongoose.model("Post", postSchema);