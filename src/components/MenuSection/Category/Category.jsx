import React, { useEffect } from "react";
import { assets } from "../../../assets/assets";
import "./Category.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";

const Category = () => {

  const { apiUrl, setToken } = React.useContext(StoreContext);

  const [image, setImage] = React.useState(false);
  const [data, setData] = React.useState({
    category_name: "",
    category_description: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_name", data.category_name);
    formData.append("category_description", data.category_description);
    formData.append("category_image", image);

    const response = await axios.post(`${apiUrl}/api/add-category`, formData);

    if (response.data.success) {
      setData({
        category_name: "",
        category_description: "",
      });
      setImage(false)
      toast.success(response.data.message)
    } else {
        toast.error(response.data.message)
    }
  };
  return (
    <div className="category content-page">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="category-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="category-name flex-col">
          <p>Category name</p>
          <input
            onChange={onChangeHandler}
            value={data.category_name}
            type="text"
            name="category_name"
            placeholder="Type here"
          />
        </div>

        <div className="category-description flex-col">
          <p>Category description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.category_description}
            name="category_description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

       
        <button type="submit" className="category-btn">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default Category;
