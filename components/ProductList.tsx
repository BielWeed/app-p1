
import React from 'react';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum produto encontrado</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece adicionando um novo produto acima.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {products.map((product) => (
        <li
          key={product.id}
          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex items-center justify-between transition-transform duration-200 hover:scale-105"
        >
          <span className="text-gray-800 dark:text-gray-200 font-medium">{product.name}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(product.created_at).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
};
