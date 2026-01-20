import React from "react";

const NewsLetter = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 20% off
      </p>
      <p className="text-gray-500 mt-3">
        Subscribe to our app and be the first to discover the latest fashion
        trends, exclusive offers, and special updates. As a welcome bonus, enjoy
        20% off your first purchase when you subscribe. Stay connected for early
        access to new collections, exciting deals, and personalized
        recommendations—making your fashion shopping smarter, easier, and more
        rewarding.
      </p>
      <form className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
        <input
          className="w-full sm:flex-1 outline-none "
          required
          type="email"
          placeholder="Enter Your Email"
        />
        <button
          onSubmit={onSubmitHandler}
          className="bg-black text-white text-xs px-10 py-4"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
