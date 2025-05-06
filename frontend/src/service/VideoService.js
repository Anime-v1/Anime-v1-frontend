import axios from "axios";

const API_URL = "http://localhost:8080/api/videos"
export const getAllVideos = async () => {
    try{
        const response = await axios.get(API_URL);
        return response.data;
    }
    catch(error){
        console.log(error);
        return [];
    }
}
export const createVideo = async (videoData) => {
    try {
        const response = await axios.post(API_URL, videoData);
        return response.data;
    } catch (error) {
        console.error("Failed to create video:", error);
        throw error;
    }
};
export const updateVideo = async (id, videoData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, videoData);
        return response.data;
    } catch (error) {
        console.error(`Failed to update video with id ${id}:`, error);
        throw error;
    }
};

export const deleteVideo = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Failed to delete video with id ${id}:`, error);
        throw error;
    }
};
