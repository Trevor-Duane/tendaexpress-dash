import React from "react";
import "./Add.css";
import Category from "../../../components/Category/Category";
import Subcategory from "../../../components/Subcategory/Subcategory";
import Item from "../../../components/Item/Item";
import Addon from "../../../components/Addon/Addon";

const Add = () => {
  const [isSelected, setIsSelected] = React.useState("category");

  const handleOptionChange = (event) => {
    setIsSelected(event.target.value);
  };
  return (
    <>
      <div className="content-page add-page">
        <div className="radio-buttons">
          <input
            type="radio"
            id="category"
            value="category"
            checked={isSelected === "category"}
            onChange={handleOptionChange}
          />
          <label htmlFor="category">Category</label>
        </div>

        <div className="radio-buttons">
          <input
            type="radio"
            id="subcategory"
            value="subcategory"
            checked={isSelected === "subcategory"}
            onChange={handleOptionChange}
          />
          <label htmlFor="subcategory">Subcategory</label>
        </div>

        <div className="radio-buttons">
          <input
            type="radio"
            id="item"
            value="item"
            checked={isSelected === "item"}
            onChange={handleOptionChange}
          />
          <label htmlFor="item">Item</label>
        </div>

        <div className="radio-buttons">
          <input
            type="radio"
            id="addon"
            value="addon"
            checked={isSelected === "addon"}
            onChange={handleOptionChange}
          />
          <label htmlFor="addon">Addon</label>
        </div>
      </div>

      <div>
        {isSelected === "category" && <Category />}
        {isSelected === "subcategory" && <Subcategory />}
        {isSelected === "item" && <Item />}
        {isSelected === "addon" && <Addon />}
      </div>
    </>
  );
};

export default Add;
