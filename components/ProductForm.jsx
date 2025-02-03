import React, { useState, useEffect } from "react";
import { read, utils, writeFile } from "xlsx";
import { Input } from "/components/ui/input";
import { Button } from "/components/ui/button";
import { Select, SelectItem } from "/components/ui/select";

export default function ProductForm() {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [recentEntries, setRecentEntries] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Загружаем данные из файла Excel или CSV
    fetch("/products.xlsx") // Поменяй на свой URL
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = utils.sheet_to_json(sheet, { header: 1 });
        setData(parsedData);
      });
  }, []);

  useEffect(() => {
    // Фильтруем продукты по введённым символам
    const products = data.slice(1).map((row) => row[3]); // Столбец D
    setFilteredProducts(products.filter((p) => p?.toLowerCase().includes(selectedProduct.toLowerCase())));
  }, [selectedProduct, data]);

  const handleSubmit = () => {
    if (!selectedProduct || !quantity) return;
    const index = data.findIndex((row) => row[3] === selectedProduct);
    if (index === -1) return;

    // Парсим и суммируем введённые значения
    const oldValue = data[index][5] || "0"; // Столбец F
    const newValue = eval((oldValue + "+" + quantity).replace(/ /g, "+"));
    data[index][5] = newValue;
    setRecentEntries((prev) => [[selectedProduct, newValue], ...prev.slice(0, 2)]);

    // Обновляем файл Excel
    const worksheet = utils.aoa_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Products");
    writeFile(workbook, "products_updated.xlsx");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Добавить количество продукта</h2>
      <label>Продукт:</label>
      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
        {filteredProducts.map((product, index) => (
          <SelectItem key={index} value={product}>{product}</SelectItem>
        ))}
      </Select>
      <label>Количество (например, 4+2+6):</label>
      <Input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <Button className="mt-4 w-full" onClick={handleSubmit}>Добавить</Button>
      <div className="mt-4">
        <h3 className="font-semibold">Последние записи:</h3>
        {recentEntries.map(([product, amount], index) => (
          <p key={index}>{product}: {amount}</p>
        ))}
      </div>
    </div>
  );
}
