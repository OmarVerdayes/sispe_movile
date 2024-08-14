import axios from 'axios';

export const fetchingTrendingMovies = async() => {
    try{
        const res = await axios.get('https://dld295hsy3.execute-api.us-east-1.amazonaws.com/Prod/films/random');
        return res.data;
    }catch(error){
        console.error("Error fetching trending movies:", error);
        throw new Error(error);
    }
}

export const getFilmsByCategory = async() => {
    try{
        const res = await axios.get('https://dld295hsy3.execute-api.us-east-1.amazonaws.com/Prod/films/category');
        return res.data;
    }catch(error){
        console.error("Error fetching categorized films:", error);
        throw new Error(error);
    }
}

export const getAllFilmsByCategory = async (categoryId) => {
    try{
        const res = await axios.get(`https://dld295hsy3.execute-api.us-east-1.amazonaws.com/Prod/films/fk_category/${categoryId}`);
        return res.data
    } catch(error) {
        console.error("Error fetching categorized films:", error);
        throw new Error(error);
    }
}

export const findMovieByName = async (title) => {
    try{
        const res = await axios.get(`https://dld295hsy3.execute-api.us-east-1.amazonaws.com/Prod/films/title/${title}`);
        return res.data;
    } catch(error) {
        if(error.response && error.response.status === 404) {
            return [];
        } else {
            console.error("Error fetching films by name: ", error);
            throw new Error(error);
        }
    }
}