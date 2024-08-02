import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String},
  createdAt: { type: Date, default: Date.now }
});

const favoritePanels = new mongoose.Schema({
  panelImage: { type: String, required: true },
  description: { type: String},
  manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', index: true },
  chapterNumber: {type: Number},
  volumeNumber: {type: Number},
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema]
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
  favoritePanels: [favoritePanels]
  // favoritePanels: [{
  //   panelImage: String,
  //   description: String,
  //   manga: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga' },
  //   comments: [commentSchema]
  // }]
}, {
  timestamps: true,
  collection: 'user'
});


export default mongoose.model('User', userSchema);