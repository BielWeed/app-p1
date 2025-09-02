
import React, { FormEvent } from 'react';

interface AddProductFormProps {
  newProductName: string;
  setNewProductName: (name: string) => void;
  handleAddProduct: (event: FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  disabled: boolean;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  newProductName,
  setNewProductName,
  handleAddProduct,
  isAdding,
  disabled
}) => {
  return (
    <form id="add-product-form" onSubmit={handleAddProduct} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
        placeholder={disabled ? "Aguardando autenticação..." : "Nome do produto"}
        aria-label="Nome do produto"
        required
        disabled={isAdding || disabled}
        className="flex-grow w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={isAdding || disabled}
        className="px-6 py-2.5 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isAdding ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adicionando...
          </>
        ) : (
          'Adicionar Produto'
        )}
      </button>
    </form>
  );
};
