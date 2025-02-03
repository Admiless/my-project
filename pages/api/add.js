import fs from "fs";
import { read, utils, writeFile } from "xlsx";

const FILE_PATH = "public/products.xlsx";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Метод не разрешён");

  const { product, quantity } = req.body;
  if (!product || !quantity) return res.status(400).send("Неверные данные");

  const buffer = fs.existsSync(FILE_PATH) ? fs.readFileSync(FILE_PATH) : null;
  const workbook = buffer ? read(buffer, { type: "buffer" }) : utils.book_new();
  const sheet = workbook.Sheets[workbook.SheetNames[0]] || utils.aoa_to_sheet([["Product", "Quantity"]]);
  const data = utils.sheet_to_json(sheet, { header: 1 });

  // Находим продукт и добавляем количество
  const index = data.findIndex((row) => row[0] === product);
  if (index === -1) {
    data.push([product, quantity]);
  } else {
    data[index][1] = eval(`${data[index][1]} + ${quantity}`);
  }

  // Обновляем Excel
  const newSheet = utils.aoa_to_sheet(data);
  workbook.Sheets[workbook.SheetNames[0]] = newSheet;
  writeFile(workbook, FILE_PATH);

  res.status(200).send("Данные обновлены");
}
