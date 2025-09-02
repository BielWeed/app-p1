
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PARENT_ORIGIN, SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';
import type { Product } from './types';
import { ProductList } from './components/ProductList';
import { AddProductForm } from './components/AddProductForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AuthPrompt } from './components/AuthPrompt';

// Supabase is loaded from CDN, so we declare it globally for TypeScript
declare global {
  interface Window {
    supabase: {
      createClient: (url: string, key: string, options?: object) => SupabaseClient;
    };
  }
}

const App: React.FC = () => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const notifyParent = useCallback((message: object) => {
    try {
      window.parent.postMessage(message, PARENT_ORIGIN);
    } catch (e) {
      console.error("Failed to send message to parent:", e);
    }
  }, []);

  const loadProducts = useCallback(async (supabaseClient: SupabaseClient) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabaseClient
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      setProducts(data || []);
    } catch (err: any) {
      setError(`Falha ao carregar produtos: ${err.message}`);
      notifyParent({ type: 'SHOW_NOTIFICATION', payload: { text: `Erro: ${err.message}`, status: 'error' } });
    } finally {
      setIsLoading(false);
    }
  }, [notifyParent]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== PARENT_ORIGIN) {
        console.warn(`Message from untrusted origin ignored: ${event.origin}`);
        return;
      }

      if (event.data && event.data.type === 'AUTH_TOKEN') {
        const token = event.data.payload;
        if (token) {
          const supabaseOptions = {
            global: {
              headers: { Authorization: `Bearer ${token}` },
            },
          };
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, supabaseOptions);
          setSupabase(client);
        } else {
          setError("Token de autenticação não recebido.");
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Signal to parent that the app is ready
    notifyParent({ type: 'APP_LOADED' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [notifyParent]);

  useEffect(() => {
    if (supabase) {
      loadProducts(supabase);
    } else {
        // After initial load, if there's no supabase client, stop loading.
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }
  }, [supabase, loadProducts]);

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newProductName.trim() || !supabase) return;

    setIsAdding(true);
    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert({ name: newProductName.trim() });

      if (insertError) {
        throw insertError;
      }
      
      setNewProductName('');
      notifyParent({ type: 'SHOW_NOTIFICATION', payload: { text: 'Produto adicionado!', status: 'success' } });
      await loadProducts(supabase); // Reload products after adding

    } catch (err: any) {
      setError(`Falha ao adicionar produto: ${err.message}`);
      notifyParent({ type: 'SHOW_NOTIFICATION', payload: { text: `Erro: ${err.message}`, status: 'error' } });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl font-sans">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciar Produtos</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Adicione e visualize produtos da sua loja.</p>
      </header>
      
      <main>
        <AddProductForm
          newProductName={newProductName}
          setNewProductName={setNewProductName}
          handleAddProduct={handleAddProduct}
          isAdding={isAdding}
          disabled={!supabase}
        />

        {error && (
            <div className="my-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">
              <p>{error}</p>
            </div>
        )}

        <div id="product-list" className="mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : !supabase ? (
            <AuthPrompt />
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
