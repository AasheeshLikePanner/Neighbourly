import mongoose, {Schema} from 'mongoose'

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'itemType'
    },
    itemType: {
        type: String,
        required: true,
        enum: ['Comment', 'Post']
    }
},
{timestamps:true})

export const Like = mongoose.model("Like", likeSchema )