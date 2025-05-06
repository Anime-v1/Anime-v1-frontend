import axios from "axios";

const API_URL ="http://localhost:8080/api/categories";

export const getAllCategories = async ()=>{
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export const getCategoryById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with ID ${id}:`, error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post(API_URL, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category with ID ${id}:`, error);
        throw error;
    }
};

// Xóa category theo ID
export const deleteCategory = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting category with ID ${id}:`, error);
        throw error;
    }
};