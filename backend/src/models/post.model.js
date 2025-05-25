import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    image: {
        type: String,
        required: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true,
        maxLength: 280,
    },
    type: {
        type: String,
        required: true,
        enum: ['help', 'recommendation', 'update', 'event'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },

    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likeCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

postSchema.index({location:'2dsphere'});


export const Post = mongoose.model("Post", postSchema);