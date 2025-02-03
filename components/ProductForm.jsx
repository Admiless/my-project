import React, { useState, useEffect } from "react";

export default function ProductForm() {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [recentEntries, setRecentEntries] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    const products = data.slice(1).map((row) => row[0]); // Столбец с продуктами
    setFilteredProducts(products.filter((p) => p?.toLowerCase().includes(selectedProduct.toLowerCase())));
  }, [selectedProduct, data]);

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity) return;

    await fetch("http://localhost:5000/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: selectedProduct, quantity }),
    });

    setSelectedProduct("");
    setQuantity("");

    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then(setData);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center flex flex-col items-center text-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Добавить количество продукта</h2>

      <div className="mb-12 w-full flex flex-col items-center">
        <label className="block mb-3">Продукт:</label>
        <div className="h-8"></div>
        <input
          className="w-3/4 p-2 border rounded"
          type="text"
          placeholder="Введите название продукта"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          list="product-list"
        />
        <datalist id="product-list">
          {filteredProducts.map((product, index) => (
            <option key={index} value={product} />
          ))}
        </datalist>
      </div>

      <div className="mb-12 w-full flex flex-col items-center">
        <label className="block mb-3">Количество (например, 4+2+6):</label>
        <div className="h-8"></div>
        <input className="w-3/4 p-2 border rounded" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>

      <div className="mb-12 w-full flex flex-col items-center">
        <div className="h-8"></div>
        <button className="w-3/4 bg-green-500 text-white p-2 rounded" onClick={handleSubmit}>Добавить</button>
      </div>

      <div className="mt-12 w-full flex flex-col items-center">
        <h3 className="font-semibold">Последние записи:</h3>
        <div className="h-8"></div>
        {recentEntries.map(([product, amount], index) => (
          <p key={index}>{product}: {amount}</p>
        ))}
      </div>

      {/* Кнопка скачивания Excel */}
      <div className="mt-6">
        <a href="http://localhost:5000/download" download className="text-blue-500 underline">
          Скачать таблицу Excel
        </a>
      </div>
    </div>
  );
}
