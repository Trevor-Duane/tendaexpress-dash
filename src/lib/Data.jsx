import axios from "axios";

export async function fetchInventoryItems() {
  try {
    const response = await axios.get('http://localhost:3000/api/list_inventory');
    const data = response.data;
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch inventory.');
  }
}