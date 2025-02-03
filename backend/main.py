from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import os

app = FastAPI()
FILE_PATH = "products.xlsx"

class Product(BaseModel):
    product: str
    quantity: str

@app.get("/products")
def get_products():
    if not os.path.exists(FILE_PATH):
        return []
    
    df = pd.read_excel(FILE_PATH)
    return df["Название"].dropna().tolist()

@app.post("/add")
def add_product(data: Product):
    if not os.path.exists(FILE_PATH):
        df = pd.DataFrame(columns=["Название", "Количество"])
    else:
        df = pd.read_excel(FILE_PATH)

    if data.product in df["Название"].values:
        df.loc[df["Название"] == data.product, "Количество"] += f"+{data.quantity}"
    else:
        df = df.append({"Название": data.product, "Количество": data.quantity}, ignore_index=True)

    df.to_excel(FILE_PATH, index=False)
    return {"message": "Данные обновлены"}

@app.get("/download")
def download_file():
    return {"url": "https://your-backend.onrender.com/static/products.xlsx"}
