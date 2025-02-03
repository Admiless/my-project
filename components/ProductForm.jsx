import React, { useState, useEffect } from "react";

export default function ProductForm() {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Загружаем данные из API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setData);
  }, []);

  // Фильтрация по введенным символам
  useEffect(() => {
    const products = data.slice(1).map((row) => row[3]); // Берет из столбца D
    setFilteredProducts(
      products.filter((p) =>
        p?.toLowerCase().includes(selectedProduct.toLowerCase())
      )
    );
  }, [selectedProduct, data]);

  // Отправка данных в API
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
      .then(setData);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center flex flex-col items-center text-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Добавить количество продукта</h2>

      {/* Поле выбора продукта */}
      <div className="mb-12 w-full flex flex-col items-center">
        <label className="block mb-3">Продукт:</label>
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

      {/* Поле ввода количества */}
      <div className="mb-12 w-full flex flex-col items-center">
        <label className="block mb-3">Количество (например, 4+2+6):</label>
        <input
          className="w-3/4 p-2 border rounded"
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      {/* Кнопка добавления */}
      <div className="mb-12 w-full flex flex-col items-center">
        <button className="w-3/4 bg-green-500 text-white p-2 rounded" onClick={handleSubmit}>
          Добавить
        </button>
      </div>

      {/* Кнопка скачивания Excel */}
      <div className="mt-6">
        <a href="/api/download" download className="text-blue-500 underline">
          Скачать таблицу Excel
        </a>
      </div>
    </div>
  );
}
