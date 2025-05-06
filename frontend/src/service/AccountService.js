import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
        });

        const { token, role } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username",username)// 👈 lưu role

        return { token, role };
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Đăng nhập thất bại");
        } else {
            throw new Error("Lỗi kết nối đến server");
        }
    }
};