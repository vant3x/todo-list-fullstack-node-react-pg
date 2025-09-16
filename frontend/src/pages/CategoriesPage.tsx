import React from 'react';
import CategoryListManager from '../components/Categoria/CategoryListManager'; // Updated import

const CategoriesPage: React.FC = () => {
  return (
    <div className="categories-page">
      <CategoryListManager /> 
    </div>
  );
};

export default CategoriesPage;
