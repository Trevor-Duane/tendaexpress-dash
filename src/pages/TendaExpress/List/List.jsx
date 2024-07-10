import React from "react";
import "./List.css";
import axios from "axios";
import { assets } from "../../../assets/assets";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";

const List = () => {

  const { apiUrl } = React.useContext(StoreContext)

  const [list, setList] = React.useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${apiUrl}/api/items`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${apiUrl}/api/remove-item`, {id: foodId})
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message)
    }
    else {
      toast.error("Error")
    }
  }

  React.useEffect(() => {
    fetchList()
  }, [])
  return(
    <div className="list add flex-col content-page">
        <p>All foods List</p>
        <div className="list-table">
            <div className="list-table-format title">
                <b>Image</b>
                <b>Name</b>
                <b>Subcategory</b>
                <b>Price</b>
                <b>Action</b>
            </div>
            {list.map((item, index) => {
                return(
                    <div key={index} className='list-table-format'>
                        <img src={`${apiUrl}/images/`+item.item_image} alt="" />
                        <p>{item.item_name}</p>
                        <p>{item.subcategory.subcategory_name}</p>
                        <p>Shs.{item.item_price}</p>
                        <p onClick={() => removeFood(item.id)}className="cursor">X</p>
                    </div>
                )
            })}
        </div>

    </div>
  )
};

export default List;
