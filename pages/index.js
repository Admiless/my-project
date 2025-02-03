import ProductForm from "@/components/ProductForm"; // ✅ Без пробела, верный регистр
export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ProductForm />
    </div>
  );
}
