import axios from "axios";

const API_URL = "http://localhost:8080/api/episodes";

export const getAllEpisodes = async () => {
    try{
        const response = await axios.get(API_URL);
        return response.data;
    }
    catch(error){
        console.error(error);
        return [];
    }
}

export const createEpisode = async (episode) => {
    try {
        const response = await axios.post(API_URL, episode);
        return response.data;
    } catch (error) {
        console.error("Failed to create episode:", error);
        throw error;
    }
};

export const getEpisodesById = async (videoId) => {
    try {
        const response = await axios.get(`${API_URL}/video/${videoId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch episode with videoId ${videoId}:`, error);
        throw error;
    }
};

export const updateEpisode = async (id, episode) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, episode);
        return response.data;
    } catch (error) {
        console.error(`Failed to update episode with id ${id}:`, error);
        throw error;
    }
};

export const deleteEpisode = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Failed to delete episode with id ${id}:`, error);
        throw error;
    }
};