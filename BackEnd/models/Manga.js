// import mongoose from 'mongoose';

// const characters = new mongoose.Schema({
//   name: { type: String}, 
//   image: { type: String},
//   description: { type: String}
// })

// const mangaSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   author: { type: String, required: true },
//   description: { type: String},
//   characters: [characters],
//   status: { 
//     type: String, 
//     enum: ['ongoing', 'completed'], 
//     required: true 
//   },
//   volumes: Number,
//   chapters: Number,
//   genre: [String],
//   coverImage: { type: String},
//   dateAdded: { type: Date, default: Date.now },
//   isDefault: { type: Boolean, default: false }
// }, {
//   timestamps: true,
//   collection: 'manga'
// });

// const Manga = mongoose.model('Manga', mangaSchema);

// export default Manga;


import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  image: { type: String },
  description: { type: String }
});

const mangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  characters: [characterSchema],
  status: { 
    type: String, 
    enum: ['ongoing', 'completed'], 
    required: true 
  },
  volumes: { type: Number, min: 0 },
  chapters: { type: Number, min: 0 },
  genre: [{
    type: String,
    enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller']
  }],
  coverImage: { type: String },
  dateAdded: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false },
  publicationYear: { type: Number },
  demographics: { 
    type: String, 
    enum: ['Shonen', 'Seinen', 'Shoujo', 'Josei']
  }
}, {
  timestamps: true,
  collection: 'manga'
});

const Manga = mongoose.model('Manga', mangaSchema);

export default Manga;