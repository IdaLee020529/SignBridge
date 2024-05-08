import React, { useState, useEffect } from "react";
import "./Library.css";
import { fetchCat } from "../../services/category.service";

interface LibraryCategories {
  category_name: string;
  category_thumbnail: string;
  category_id: number;
}

export default function Library() {
  const [categories, setCategories] = useState<LibraryCategories[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await fetchCat();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="library">
      <h2 className="title">Library</h2>
      <div className="grid">
        {categories.map((category) => (
          <div key={category.category_id} className="card">
            <img src={category.category_thumbnail} alt={category.category_name} className="thumbnail" />
            <div className="categoryName">{category.category_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
