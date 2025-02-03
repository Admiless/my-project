import React, { useState, useEffect } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleSubmit = async () => {
    if (!selectedProduct || !quantity) return;

    await fetch("/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: selectedProduct, quantity }),
    });

    setSelectedProduct("");
    setQuantity("");

    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Добавить количество</h2>

        <input
          className="w-full p-2 border rounded mb-4"
          list="products"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          placeholder="Введите название продукта"
        />
        <datalist id="products">
          {products.map((p, index) => (
            <option key={index} value={p} />
          ))}
        </datalist>

        <input
          className="w-full p-2 border rounded mb-4"
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Введите количество (например, 4+2)"
        />

        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          onClick={handleSubmit}
        >
          Добавить
        </button>

        <div className="mt-4">
          <a href="/api/download" className="text-blue-500 underline">
            Скачать таблицу
          </a>
        </div>
      </div>
    </div>
  );
}
