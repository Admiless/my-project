
import fs from "fs";
import path from "path";
import { read, utils } from "xlsx";

const FILE_PATH = path.join(process.cwd(), "public/products.xlsx");

export default function handler(req, res) {
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(200).json([]);
  }

  const buffer = fs.readFileSync(FILE_PATH);
  const workbook = read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = utils.sheet_to_json(sheet, { header: 1 });

  const products = data.slice(1).map((row) => row[3]); // Берём из столбца D

  res.status(200).json(products);
}
