import mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
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

export const Comment = mongoose.model('Comment', commentSchema);