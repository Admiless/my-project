import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "public/products.xlsx");

export default function handler(req, res) {
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(404).send("Файл не найден");
  }

  res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

  const fileStream = fs.createReadStream(FILE_PATH);
  fileStream.pipe(res);
}
