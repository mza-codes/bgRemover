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

export const fetchProcessed = async (formData, signal) => {
    try {
        const data = await axios.post(
            'http://localhost:8000/populate ', formData, {
            signal,
            timeout: (120 * 1000)
        });
        console.log(data);
        return data;
    } catch (err) {
        console.warn("ERROR Occured");
        console.log(err);
        return err;
    };
}

// Conversion to Base64 for future Development
const blobToBase64 = async blob => {
    return new Promise(async (resolve, reject) => {
        let base64data;
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            base64data = reader.result;
            resolve(base64data);
        };
        reader.error = (err) => reject(err);
    });
};