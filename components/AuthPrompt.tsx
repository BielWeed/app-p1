
import React from 'react';

export const AuthPrompt: React.FC = () => {
  return (
    <div className="text-center py-10 px-4 bg-yellow-50 dark:bg-gray-700 border border-yellow-300 dark:border-yellow-600 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-yellow-800 dark:text-yellow-200">Aguardando Autenticação</h3>
      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
        Este aplicativo está aguardando as credenciais do aplicativo principal para carregar os dados.
      </p>
    </div>
  );
};
