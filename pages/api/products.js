import fs from "fs";
import { read, utils } from "xlsx";

const FILE_PATH = "public/products.xlsx";

export default function handler(req, res) {
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(404).json({ error: "Файл products.xlsx не найден" });
  }

  const buffer = fs.readFileSync(FILE_PATH);
  const workbook = read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = utils.sheet_to_json(sheet, { header: 1 });

  res.status(200).json(data);
}
