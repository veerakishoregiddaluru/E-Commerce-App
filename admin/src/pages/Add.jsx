import { assets } from "../assets/assets";
import { backendUrl } from "../App";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } },
      );

      console.log(response.data);

      if (response.data.status) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error in Adding Products", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 bg-slate-50 min-h-screen">
      <h3 className="mb-6 text-xl font-bold text-slate-800">
        ➕ Add New Product
      </h3>

      <form
        onSubmit={onSubmitHandler}
        className="
      flex flex-col gap-6
      max-w-3xl
      bg-white
      border border-slate-200
      rounded-2xl
      p-5 sm:p-6
      shadow-sm
    "
      >
        {/* IMAGES */}
        <div>
          <p className="mb-3 font-semibold text-slate-700">🖼 Upload Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[image1, image2, image3, image4].map((img, i) => (
              <label
                key={i}
                className="
              flex items-center justify-center
              border-2 border-dashed
              border-indigo-200
              rounded-xl
              cursor-pointer
              hover:border-indigo-400
              transition
              bg-slate-50
            "
              >
                <img
                  className="w-full h-24 object-contain p-2"
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt=""
                />
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    [setImage1, setImage2, setImage3, setImage4][i](
                      e.target.files[0],
                    )
                  }
                />
              </label>
            ))}
          </div>
        </div>

        {/* NAME */}
        <div>
          <p className="mb-1 font-semibold text-slate-700">Product Name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
          w-full
          border
          rounded-xl
          px-4 py-2
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-400
        "
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <p className="mb-1 font-semibold text-slate-700">Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
          w-full
          border
          rounded-xl
          px-4 py-2
          min-h-[90px]
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-400
        "
            required
          />
        </div>

        {/* CATEGORY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
          border
          rounded-xl
          px-4 py-2
          bg-slate-50
          text-slate-700
          font-medium
          focus:ring-2
          focus:ring-indigo-400
        "
          >
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>

          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="
          border
          rounded-xl
          px-4 py-2
          bg-slate-50
          text-slate-700
          font-medium
          focus:ring-2
          focus:ring-indigo-400
        "
          >
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Winterwear</option>
          </select>

          <div className="relative">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Price"
              className="
            w-full
            border
            rounded-xl
            px-4 py-2
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-400
          "
            />
            <span className="absolute top-2.5 right-3 text-slate-400 text-sm">
              ₹
            </span>
          </div>
        </div>

        {/* SIZES */}
        <div>
          <p className="mb-2 font-semibold text-slate-700">Available Sizes</p>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <p
                key={s}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(s)
                      ? prev.filter((i) => i !== s)
                      : [...prev, s],
                  )
                }
                className={`
              px-4 py-1.5
              rounded-full
              cursor-pointer
              text-sm
              font-medium
              transition
              ${
                sizes.includes(s)
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }
            `}
              >
                {s}
              </p>
            ))}
          </div>
        </div>

        {/* BESTSELLER */}
        <label className="flex items-center gap-2 text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={() => setBestseller((p) => !p)}
            className="accent-indigo-600"
          />
          Mark as Bestseller
        </label>

        {/* BUTTON */}
        <button
          type="submit"
          className="
        bg-indigo-600
        hover:bg-indigo-700
        text-white
        rounded-xl
        px-6
        py-2
        text-sm
        font-semibold
        inline-flex
        w-fit
        mt-2
        mb-20 sm:mb-6
        transition
      "
        >
          ADD PRODUCT
        </button>
      </form>
    </div>
  );
};

export default Add;
