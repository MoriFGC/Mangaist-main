import mongoose from 'mongoose';

const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  characters: [{ 
    name: String, 
    image: String 
  }],
  status: { 
    type: String, 
    enum: ['ongoing', 'completed'], 
    required: true 
  },
  volumes: Number,
  chapters: Number,
  genre: [String],
  coverImage: String,
  dateAdded: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false }
}, {
  timestamps: true,
  collection: 'manga'
});

const Manga = mongoose.model('Manga', mangaSchema);

export default Manga;