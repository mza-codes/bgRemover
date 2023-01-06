import axios from 'axios';
import { useState } from 'react';
import { fetchImage } from '../../Api';
import './home.css';

const Home = () => {
    const [image, setImage] = useState("");
    const [image2, setImage2] = useState("");
    const [loading, setLoading] = useState(false);
    const [blob, setblob] = useState({});
    const [validImg, setValidImg] = useState(false);
    const [err, setErr] = useState();

    const [base64, setBase64] = useState(null);

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
            reader.error = (err) => { setErr(err); reject(err) };
        });
    };

    const handleImageUpload = async (file) => {
        console.log(file?.type);
        if (file?.type?.includes("image/jpeg", "image/png", "image/bmp", "image/svg", "image/jpg", "image/webp")) {
            setValidImg(true);
        };
        setLoading(true);
        setImage(URL.createObjectURL(file));
        setblob(file);
        const imageBase64 = await blobToBase64(file);
        setBase64(imageBase64);
        setLoading(false);
    };

    const handleTask = async () => {
        setLoading(true);
        // Adding to FormData
        const formD = new FormData();
        formD.append('size', 'auto');
        formD.append('image_file', blob);
        await axios.request({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formD,
            responseType: 'arraybuffer',
            headers: {
                'X-Api-Key': process.env.REACT_APP_API_KEY,
            },
            encoding: null
        }).then((res) => {
            const arrayBufferView = new Uint8Array(res.data);
            const blob = new Blob([arrayBufferView], { type: "image/png" });
            // const blob = new Blob([arrayBufferView]);
            console.log("server fetched blob", blob);
            setImage2(URL.createObjectURL(blob));
            console.log('COMPLETED');
            setLoading(false);
        }).catch((err) => {
            console.log("Error OCCured", err);
            setErr(err);
            setLoading(false);
        });
    }

    const handleApiReq = async () => {
        const controller = new AbortController();
        const data = await fetchImage(base64,controller.signal);
        console.log(data);
        return;
    };

    return (
        <div className='home'>
            <div className="titleContainer">
                <p className='appTitle wiggleFont'>Image BG Remover<span className='author'>-mza</span></p>
            </div>
            <div className="mainWrapper">
                <div className="imgContainer">
                    <h3>Input Image</h3>
                    {image && <img className='image' id='photo' src={image} alt="_load_image" />}
                </div>
                <div className="inputContainer">
                    <label htmlFor="image" className='pointer'>Select Image</label>
                    <input id='image' hidden type="file" accept='image/*'
                        onChange={e => { handleImageUpload(e?.target?.files[0]); }} />
                    <div className="imgInfo">
                        <p>{blob?.name}</p>
                        <p>{blob?.type}</p>
                        {blob?.size && <p>{parseInt(blob?.size) * 1e-6 + "MB"}</p>}
                    </div>
                    {validImg && <div className="submitArea">
                        {loading ? <h6>Loading...</h6> :
                            <button type='button' onClick={handleTask}> Submit </button>}
                        <p>{err?.message}</p>
                    </div>}
                </div>
                <div className="imgContainer">
                    <h3>Result Image</h3>
                    {image2 && <img className='image' src={image2} alt="_load_image" />}
                </div>
                {/* <div className="resultContainer">

                </div> */}
            </div>
        </div>
    )
}

export default Home