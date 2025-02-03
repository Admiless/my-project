const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { read, utils, writeFile } = require("xlsx");

const app = express();
app.use(express.json());
app.use(cors());

const FILE_PATH = "./public/products.xlsx";

// Функция загрузки Excel-файла
const loadWorkbook = () => {
  if (fs.existsSync(FILE_PATH)) {
    const buffer = fs.readFileSync(FILE_PATH);
    return read(buffer, { type: "buffer" });
  }
  return utils.book_new();
};

// Получение данных
app.get("/products", (req, res) => {
  const workbook = loadWorkbook();
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = utils.sheet_to_json(sheet, { header: 1 });
  res.json(data);
});

// Добавление количества продукта
app.post("/add", (req, res) => {
  const { product, quantity } = req.body;
  if (!product || !quantity) return res.status(400).send("Invalid data");

  const workbook = loadWorkbook();
  const sheet = workbook.Sheets[workbook.SheetNames[0]] || utils.aoa_to_sheet([["Product", "Quantity"]]);
  const data = utils.sheet_to_json(sheet, { header: 1 });

  const index = data.findIndex((row) => row[0] === product);
  if (index === -1) {
    data.push([product, quantity]);
  } else {
    data[index][1] = eval(`${data[index][1]} + ${quantity}`);
  }

  const newSheet = utils.aoa_to_sheet(data);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  writeFile(workbook, FILE_PATH);
  res.send("Updated successfully");
});

// Скачивание Excel-файла
app.get("/download", (req, res) => {
  res.download(FILE_PATH);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
