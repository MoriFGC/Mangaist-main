import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  profilePublic: { type: Boolean, default: false },
  manga: [{
    manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
    readingStatus: { 
      type: String, 
      enum: ['to-read', 'reading', 'completed'], 
      default: 'to-read' 
    },
    currentChapter: Number,
    currentVolume: Number
  }],
  favoritePanels: [{
    panelImage: String,
    description: String,
    manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
    comments: [commentSchema]
  }]
}, {
  timestamps: true,
  collection: 'user'
});


export default mongoose.model('User', userSchema);