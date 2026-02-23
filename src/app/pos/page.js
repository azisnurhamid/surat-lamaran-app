'use client';

import { useState } from 'react';
import Link from 'next/link';
import BarcodeScanner from '../../components/BarcodeScanner';

// Sample product data (same as produk page)
const products = [
  { id: 1, nama: 'Kopi Luwak', sku: 'KPL-001', barcode: '8991234567890', harga: 45000, stok: 100 },
  { id: 2, nama: 'Teh Hijau', sku: 'THJ-002', barcode: '8991234567891', harga: 25000, stok: 150 },
  { id: 3, nama: 'Kopi Espresso', sku: 'KPE-003', barcode: '8991234567892', harga: 35000, stok: 80 },
  { id: 4, nama: 'Susu UHT', sku: 'SUS-004', barcode: '8991234567893', harga: 15000, stok: 200 },
  { id: 5, nama: 'Roti Tawar', sku: 'ROT-005', barcode: '8991234567894', harga: 12000, stok: 50 },
];

export default function PosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('semua');
  const [showScanner, setShowScanner] = useState(false);
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case 'nama':
        return product.nama.toLowerCase().includes(query);
      case 'sku':
        return product.sku.toLowerCase().includes(query);
      case 'barcode':
        return product.barcode.includes(query);
      default:
        return (
          product.nama.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.barcode.includes(query)
        );
    }
  });

  const handleScan = (barcode) => {
    setSearchQuery(barcode);
    setSearchType('barcode');
    setShowScanner(false);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.jumlah < product.stok) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, jumlah: item.jumlah + 1 } : item
          )
        );
      } else {
        alert('Stok tidak mencukupi!');
      }
    } else {
      if (product.stok > 0) {
        setCart([...cart, { ...product, jumlah: 1 }]);
      } else {
        alert('Produk sedang kosong!');
      }
    }
  };

  const updateQuantity = (id, newQuantity) => {
    const product = products.find((p) => p.id === id);
    if (newQuantity < 1) {
      removeFromCart(id);
    } else if (newQuantity <= product.stok) {
      setCart(
        cart.map((item) => (item.id === id ? { ...item, jumlah: newQuantity } : item))
      );
    } else {
      alert('Stok tidak mencukupi!');
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.harga * item.jumlah, 0);
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.jumlah, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }
    
    // Process checkout
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:bg-blue-700 p-2 rounded transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">Point of Sale</h1>
            </div>
            <Link href="/produk" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Kelola Produk
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Type Selector */}
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="semua">Semua</option>
                  <option value="nama">Nama Produk</option>
                  <option value="sku">SKU</option>
                  <option value="barcode">Barcode</option>
                </select>

                {/* Search Input */}
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => setShowScanner(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Scan
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Daftar Produk</h2>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'Produk tidak ditemukan' : 'Tidak ada produk'}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={product.stok === 0}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="font-medium text-gray-900 truncate">{product.nama}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                      <div className="mt-2 font-bold text-blue-600">
                        {formatCurrency(product.harga)}
                      </div>
                      <div className={`text-sm ${product.stok > 10 ? 'text-green-600' : product.stok > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        Stok: {product.stok}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Keranjang</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {calculateTotalItems()} item
                </span>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Keranjang kosong
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.nama}</div>
                        <div className="text-sm text-gray-500">{formatCurrency(item.harga)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.jumlah - 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.jumlah}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.jumlah + 1)}
                          className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total and Checkout */}
              {cart.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Bayar & Selesai
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center animate-pulse">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Transaksi Berhasil!</h3>
            <p className="text-gray-600">Terima kasih telah bertransaksi</p>
          </div>
        </div>
      )}
    </div>
  );
}
