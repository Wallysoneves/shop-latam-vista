
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductGrid from '../components/product/ProductGrid';
import { useProducts } from '../contexts/ProductContext';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types/Product';

const HomePage = () => {
  const { products, categories } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      // Featured products (random selection for demo)
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 4));
      
      // New arrivals (most recent by created date)
      const sorted = [...products].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNewArrivals(sorted.slice(0, 8));
      
      // Best sellers (by sales count)
      const topSelling = [...products].sort((a, b) => b.sales - a.sales);
      setBestSellers(topSelling.slice(0, 8));
      
      setLoading(false);
    }
  }, [products]);

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-market-blue to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                O maior marketplace da América Latina
              </h1>
              <p className="text-lg mb-6 opacity-90">
                Encontre produtos de vendedores de todo Brasil e América Latina em um só lugar!
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="bg-market-yellow hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Explorar Produtos
                </Link>
                <Link
                  to="/seller"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Vender Produtos
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <img 
                src="https://source.unsplash.com/random/800x600/?marketplace" 
                alt="LatinVista Marketplace" 
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Categorias em Destaque</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category, index) => (
              <Link 
                key={index}
                to={`/products?category=${category}`}
                className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-lg transition-shadow group"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-market-yellow/10 transition-colors">
                  <img 
                    src={`https://source.unsplash.com/random/100x100/?${category.toLowerCase()}`}
                    alt={category}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-medium text-gray-800">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
            <Link to="/products" className="text-market-blue hover:text-blue-700 flex items-center">
              <span>Ver Todos</span>
              <ChevronRight size={20} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Novidades</h2>
            <Link 
              to="/products?sortBy=newest" 
              className="text-market-blue hover:text-blue-700 flex items-center"
            >
              <span>Ver Todos</span>
              <ChevronRight size={20} />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Mais Vendidos</h2>
            <Link 
              to="/products?sortBy=bestSelling" 
              className="text-market-blue hover:text-blue-700 flex items-center"
            >
              <span>Ver Todos</span>
              <ChevronRight size={20} />
            </Link>
          </div>
          <ProductGrid products={bestSellers} loading={loading} />
        </div>
      </section>

      {/* Call to action for sellers */}
      <section className="py-16 bg-market-yellow text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Venda seus produtos na LatinVista</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Alcance milhões de clientes em toda a América Latina. Cadastre-se gratuitamente e comece a vender hoje mesmo!
          </p>
          <Link
            to="/seller"
            className="bg-white text-market-yellow hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block"
          >
            Começar a vender
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
