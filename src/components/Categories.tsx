import React from 'react';
import { API_URL, getCategories } from '@api';
import { Link } from 'framework7-react';
import { Category } from '@constants';
import { useQuery } from 'react-query';
const Categories = () => {
  const { data: categories, isError } = useQuery('categories', getCategories);
  if (isError) {
    return (
      <div className="h-32 flex items-center justify-center">
        <span className="text-gray-400">서버에 문제가 발생 했습니다. </span>
      </div>
    );
  }
  return (
    <div className="mt-2 grid grid-cols-6 gap-2 p-2 border-b">
      {categories &&
        categories.data.slice(6, 12).map((category: Category) => (
          <div key={category.id}>
            <Link
              href={`/items?category_id=${category.id}`}
              className="bg-white h-20 flex flex-col items-center justify-center"
              key={category.id}
            >
              <img src={API_URL + category.image_path} alt="#" className="w-9 h-9 rounded-lg " />
              <span className="text-gray-500 mt-1">{category.title}</span>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default React.memo(Categories);
