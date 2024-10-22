import React from "react";

const Hero = () => {
  return (
    <div className="h-screen md:h-[75vh] flex flex-col md:flex-row">
      <div className="w-full lg:w-3/6 flex items-center flex-col lg:items-start justify-center">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Discover your next great read
        </h1>
        <p className="mt-4 text-xl text-zinc-300 text-center lg:text-left">
          Uncover captivating stories, enriching knowledge, and endless
          inspiring in our curated collection of books.
        </p>
        <div className="mt-8">
          <button className="text-yellow-100 text-xl lg:text-2xl font-semibold border border-yellow-100 px-10 py-3 hover:bg-zinc-800 rounded-full">
            Discover Books.
          </button>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center">
        
        <img src="https://png.pngtree.com/png-vector/20221024/ourmid/pngtree-stack-of-books-cartoon-pile-png-image_6349246.png" alt="BookLogo" />
      </div>
    </div>
  );
};

export default Hero;
