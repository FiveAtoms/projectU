const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 100,
        require: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    skillNames: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            require: true,
        }
    ],
    skillCapacities: [
        {
            type: Number,
            require: true,
        }
    ],
    skillFills: [
        {
            type: Number,
            require: true,
        }
    ],
    time: {
        type: Date,
        required:true,
    },
    description: {
        type: String,
        minlength: 100,
        maxLength: 1000,
        require: true,
        unique: true,
    },
    color: {
        type: String,
        maxlength: 20,
        require:true,
    },
    imageLinks: [
        {
            type: String,
        }
    ],
    referenceLinks: [
        {
            type: String
        }
    ]
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject._id = returnedObject._id.toString()
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Post', postSchema)