import axios from "axios";

export const fetchImage = async (base64, signal) => {
    try {
        const { data } = await axios.post('http://localhost:8000/upload ', { image: base64 }, { signal });
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
        return err;
    };
};