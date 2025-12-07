const mongoose = require('mongoose');

const GrillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Titlul este obligatoriu'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Descrierea este obligatorie'],
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner-ul este obligatoriu']
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Virtual pentru numărul de MICI (likes)
GrillSchema.virtual('miciCount').get(function() {
    return this.likes.length;
});

// Include virtuals în JSON și Object
GrillSchema.set('toJSON', { virtuals: true });
GrillSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Grill', GrillSchema);
