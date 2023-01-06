import axios from 'axios';
import { useState } from 'react';
import Loader from '../../Components/Loader/Loader';
import './home.css';

let controller;
const Home = () => {
    const [image, setImage] = useState("");
    const [image2, setImage2] = useState("");
    const [loading, setLoading] = useState(false);
    const [blob, setblob] = useState({});
    const [validImg, setValidImg] = useState(false);
    const [err, setErr] = useState();

    const handleImageUpload = async (file) => {
        console.log(file?.type);
        if (file?.type?.includes("image/jpeg", "image/png", "image/bmp", "image/svg", "image/jpg", "image/webp")) {
            setValidImg(true);
        };
        setLoading(true);
        setImage(URL.createObjectURL(file));
        setblob(file);
        setLoading(false);
    };

    // bg.remove api needs access key
    const handleTask = async () => {
        setLoading(true);
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
        controller?.abort();
        setLoading(true);
        controller = new AbortController();
        const formData = new FormData();
        formData.append("image", blob);
        try {
            const { data } = await axios.post(
                'http://localhost:8000/populate ', formData, {
                signal: controller.signal,
                timeout: (120 * 1000)
            });
            console.log(data);
            setImage2(`http://${data}`);
        } catch (err) {
            console.warn("ERROR Occured");
            console.log(err);
            setErr(err);
        } finally {
            setLoading(false);
            return;
        };
    };

    return (
        <main className='home'>
            <div className="titleContainer">
                <p className='appTitle wiggleFont'>Image BG Remover<span className='author'>-mza</span></p>
            </div>
            <section className="mainWrapper">
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

                    {loading && <Loader />}

                    {validImg &&
                        <div className="submitArea">
                            <button type='button' onClick={handleApiReq} disabled={loading}> Submit </button>
                            <p>{err?.message}</p>
                        </div>
                    }

                </div>
                <div className="imgContainer">
                    <h3>Result Image</h3>
                    {image2 && <img className='image' src={image2} alt="_load_image" />}
                </div>
            </section>
        </main>
    )
}

export default Home