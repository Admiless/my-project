import fs from "fs";
import path from "path";
import { read, utils, writeFile } from "xlsx";

const FILE_PATH = path.join(process.cwd(), "public/products.xlsx");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  const { product, quantity } = req.body;
  if (!product || !quantity) {
    return res.status(400).json({ error: "Неверные данные" });
  }

  let workbook;
  let data;

  // Загружаем или создаём новый Excel-файл
  if (fs.existsSync(FILE_PATH)) {
    const buffer = fs.readFileSync(FILE_PATH);
    workbook = read(buffer, { type: "buffer" });
  } else {
    workbook = utils.book_new();
  }

  const sheetName = workbook.SheetNames[0] || "Products";
  let sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    sheet = utils.aoa_to_sheet([["Product", "", "", "Название", "", "Количество"]]);
    workbook.Sheets[sheetName] = sheet;
  }

  data = utils.sheet_to_json(sheet, { header: 1 });

  // Находим продукт по названию в столбце D (3-й индекс)
  const index = data.findIndex((row) => row[3] === product);

  if (index === -1) {
    // Если продукта нет, добавляем новую строку
    data.push(["", "", "", product, "", quantity]);
  } else {
    // Если продукт есть, обновляем его количество в столбце F (5-й индекс)
 
