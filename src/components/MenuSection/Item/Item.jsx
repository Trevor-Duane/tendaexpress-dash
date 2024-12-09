import React, { useEffect } from "react";
import { assets } from "../../../assets/assets";
import "./Item.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";

const Item = () => {
  const { apiUrl } = React.useContext(StoreContext);

  const [subcategories, setSubcategories] = React.useState([]);

  const [image, setImage] = React.useState(false);
  const [data, setData] = React.useState({
    item_name: "",
    item_description: "",
    item_price: "",
    item_rating: "",
    subcategory_id: 1,
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };

  const fetchSubcategories = async (e) => {
    try {
      const response = await axios.get(`${apiUrl}/api/subcategories`);
      if (response.data.success) {
        console.log("subcategories", response.data.data);
        setSubcategories(response.data.data);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  React.useEffect(() => {
    fetchSubcategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("item_name", data.item_name);
    formData.append("item_description", data.item_description);
    formData.append("subcategory_id", data.subcategory_id);
    formData.append("item_price", Number(data.item_price));
    formData.append("item_rating", Number(data.item_rating));
    formData.append("item_image", image);

    const response = await axios.post(`${apiUrl}/api/add-item`, formData);

    if (response.data.success) {
      setData({
        item_name: "",
        item_description: "",
        item_price: "",
        item_rating: 5,
        subcategory_id: "",
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };
  return (
    <div className="item content-page">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="item-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (image) {
                  URL.revokeObjectURL(image); // Revoke the old URL
                }
                setImage(file); // Set new file
              }
            }}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="item-name flex-col">
          <p>Item name</p>
          <input
            onChange={onChangeHandler}
            value={data.item_name}
            type="text"
            name="item_name"
            placeholder="Type here"
          />
        </div>

        <div className="item-description flex-col">
          <p>Item description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.item_description}
            name="item_description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>

        <div className="item-subcategory-price">
          <div className="item-subcategory flex-col">
            <p>Item subcategory</p>
            <select
              onChange={onChangeHandler}
              value={data.subcategory_id}
              name="subcategory_id"
            >
              {subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory.id}>
                  {subcategory.subcategory_name}
                </option>
              ))}
            </select>
          </div>
          <div className="item-price flex-col">
            <p>item price</p>
            <input
              onChange={onChangeHandler}
              value={data.item_price}
              type="number"
              name="item_price"
              placeholder="Shs.1000"
            />
          </div>

          <div className="item-price flex-col">
            <p>Item rating</p>
            <select onChange={onChangeHandler} name="item_rating">
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="3">2</option>
              <option value="3">1</option>
            </select>
          </div>
        </div>
        <button type="submit" className="item-btn">
          Create Item
        </button>
      </form>
    </div>
  );
};

export default Item;
