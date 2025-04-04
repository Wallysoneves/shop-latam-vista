
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-xl font-bold mb-4">LatinVista</h3>
            <p className="text-gray-300 mb-4">
              O maior marketplace da América Latina, conectando vendedores e compradores de todo o continente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-market-yellow transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-market-yellow transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-market-yellow transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Venda Conosco
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Política de Devolução
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Informações de Envio
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-market-yellow transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-market-yellow mt-1" />
                <span className="text-gray-300">
                  Av. Paulista, 1000<br />
                  São Paulo, SP - Brasil
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-market-yellow" />
                <span className="text-gray-300">+55 11 1234-5678</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-market-yellow" />
                <span className="text-gray-300">contato@latinvista.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LatinVista Marketplace. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
