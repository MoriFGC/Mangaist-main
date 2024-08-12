import mongoose from "mongoose";

// schema per i commenti dei post 
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String},
  createdAt: { type: Date, default: Date.now }
}); 

// schema per i post dell'utente con i suoi pannelli preferiti
const favoritePanels = new mongoose.Schema({
  panelImage: { type: String, required: true },
  description: { type: String},
  manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', index: true },
  chapterNumber: {type: Number},
  volumeNumber: {type: Number},
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  cognome: {type: String},
  nickname: { type: String},
  email: { type: String },
  profileImage: {type: String},
  profilePublic: { type: Boolean, default: false },
  authId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profileCompleted: { type: Boolean, default: false },
manga: [{
    manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
    readingStatus: { 
      type: String, 
      enum: ['to-read', 'reading', 'completed'], 
      default: 'to-read' 
    },
    currentChapter: Number,
    currentVolume: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  favoritePanels: [favoritePanels]
}, {
  timestamps: true,
  collection: 'user'
});

export default mongoose.model('User', userSchema);