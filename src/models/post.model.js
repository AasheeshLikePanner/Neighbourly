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
        trim:true,
        maxLength: 280,
    },
    type:{
        type:String,
        required:true,
        enum: ['Ask for help', 'Recommend a place', 'Share a local update', 'Event announcement'],
    },
    state:{
        type:String,
        required:true
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