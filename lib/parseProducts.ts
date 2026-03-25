import Papa from "papaparse";
import { Product } from "@/types/product";

function extractPlainText(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    const texts: string[] = [];
    function walk(node: any) {
      if (!node) return;
      if (node.type === "text" && typeof node.value === "string") {
        texts.push(node.value);
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }
    walk(parsed);
    return texts.join(" ").trim();
  } catch {
    return "";
  }
}

export async function loadProducts(): Promise<Product[]> {
  const response = await fetch("/product-data.csv");
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
      complete: (results) => {
        const products: Product[] = (results.data as any[]).map((row, index) => ({
          id: String(index + 1),
          name: row["Product name"] || "",
          vendor: row["Vendor"] || "",
          type: row["Type"] || "",
          productType: row["Product type"] || "",
          amountOfPills: parseInt(row["Amount of pills"]) || 0,
          daysOfUsage: parseInt(row["Days of usage"]) || 0,
          deliveryFrequency: `Every ${row["Delivery frequency every [number] month"]} month(s)`,
          rawDescription: row["Product description"] || "",
          description: extractPlainText(row["Product description"] || ""),
        }));
        resolve(products);
      },
      error: reject,
    });
  });
}
