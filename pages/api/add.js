import fs from "fs";
import path from "path";
import { read, utils, writeFile } from "xlsx";

const FILE_PATH = path.join(process.cwd(), "public/products.xlsx");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не разрешён" });

  const { product, quantity } = req.body;
  if (!product || !quantity) return res.status(400).json({ error: "Неверные данные" });

  let workbook;
  let data;

  if (fs.existsSync(FILE_PATH)) {
    const buffer = fs.readFileSync(FILE_PATH);
    workbook = read(buffer, { type: "buffer" });
  } else {
    workbook = utils.book_new();
  }

  const sheetName = workbook.SheetNames[0] || "Products";
  let sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    sheet = utils.aoa_to_sheet([["", "", "", "Название", "", "Количество"]]);
    workbook.Sheets[sheetName] = sheet;
  }

  data = utils.sheet_to_json(sheet, { header: 1 });

  const index = data.findIndex((row) => row[3] === product);

  if (index === -1) {
    data.push(["", "", "", product, "", quantity]);
  } else {
    const oldValue = data[index][5] || "0";
    data[index][5] = eval(`${oldValue} + ${quantity}`);
  }

  const newSheet = utils.aoa_to_sheet(data);
  workbook.Sheets[sheetName] = newSheet;
  writeFile(workbook, FILE_PATH);

  res.status(200).json({ message: "Данные обновлены", data });
}
