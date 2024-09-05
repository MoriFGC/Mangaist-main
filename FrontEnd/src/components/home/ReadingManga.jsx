import React from "react";
import { Link } from "react-router-dom";

const ReadingManga = ({ manga }) => {
  if (!manga || manga.length === 0) return null;
  console.log(manga);
  return (
    <div className="bg-black rounded-lg p-4">
      <h2 className="text-white text-lg font-bold mb-3">Manga in lettura</h2>
      <div className="space-y-4">
        {manga.map((item) => (
          <Link
            key={item._id}
            to={`/manga/${item._id}`}
            className="flex items-center hover:bg-button-bg p-2 rounded-lg transition duration-300"
          >
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-16 h-24 object-cover rounded-md mr-3"
            />
            <div className="flex-grow">
              <p className="text-white mb-1">{item.title}</p>
              <div className="w-full bg-[#27272A] rounded-full h-2.5">
                <div
                  className="bg-white h-2.5 rounded-full"
                  style={{
                    width: `${
                      (item.currentChapter / item.totalChapters) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {item.currentChapter} / {item.totalChapters} capitoli
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReadingManga;
