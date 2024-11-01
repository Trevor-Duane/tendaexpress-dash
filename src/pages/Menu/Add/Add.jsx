import React from "react";
import "./Add.css";
import Category from "../../../components/MenuSection/Category/Category";
import Subcategory from "../../../components/MenuSection/Subcategory/Subcategory";
import Item from "../../../components/MenuSection/Item/Item";
import Addon from "../../../components/MenuSection/Addon/Addon";
import Recipe from "../../../components/MenuSection/Recipe/Recipe";

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

        <div className="radio-buttons">
          <input
            type="radio"
            id="recipe"
            value="recipe"
            checked={isSelected === "recipe"}
            onChange={handleOptionChange}
          />
          <label htmlFor="recipe">Recipe</label>
        </div>
      </div>

      <div>
        {isSelected === "category" && <Category />}
        {isSelected === "subcategory" && <Subcategory />}
        {isSelected === "item" && <Item />}
        {isSelected === "addon" && <Addon />}
        {isSelected === "recipe" && <Recipe />}
      </div>
    </>
  );
};

export default Add;
