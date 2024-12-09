import React, { useEffect } from "react";
import "./Subcategory.css";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";


const Subcategory = () => {
  const { apiUrl } = React.useContext(StoreContext);

  console.log("env", apiUrl);
  const [categories, setCategories] = React.useState([]);

  const [data, setData] = React.useState({
    category_id: 1,
    subcategory_name: "",
  });

  const fetchCategories = () => {
    console.log("fetching categories")
    axios.get(`${apiUrl}/api/categories`)
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.data);
          console.log("have fetched categories", response.data);
        } else {
          toast.error(response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("An error occurred while fetching categories.");
      });
  };
  
  React.useEffect(() => {
    fetchCategories();
  }, []);
  

  // const fetchCategories = (e) => {
  //   try {
  //     const response = axios.get(`${apiUrl}/api/categories`);
  //     if (response.data.success) {
  //       setCategories(response.data.data);
  //       console.log("have fetched categories", response.data)
  //     } else {
  //       toast.error(response.data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories:", error); // Log the error in the console
  //     toast.error("An error occurred while fetching categories.");
  //   }
  // };

  // React.useEffect(() => {
  //   fetchCategories();
  // }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append("subcategory_name", data.subcategory_name);
    // formData.append("category_id", data.category_id);

    const response = await axios.post(`${apiUrl}/api/add-subcategory`, {
      subcategory_name: data.subcategory_name,
      category_id: data.category_id,
    });

    if (response.data.success) {
      setData({
        category_id: 1,
        subcategory_name: "",
      });
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="subcategory content-page">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="subcategory-name flex-col">
          <p>Subcategory name</p>
          <input
            onChange={onChangeHandler}
            value={data.subcategory_name}
            type="text"
            name="subcategory_name"
            placeholder="Type here"
          />
        </div>

        <div className="subcategory-id">
          <div className="subcategory flex-col">
            <p>Choose category</p>
            <select
              onChange={onChangeHandler}
              value={data.category_id}
              name="category_id"
            >
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>

          </div>
        </div>
        <button type="submit" className="subcategory-btn">
          Create Subcategory
        </button>
      </form>
    </div>
  );
};

export default Subcategory;
