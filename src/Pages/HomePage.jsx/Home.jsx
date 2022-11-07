import axios from 'axios';
import { useState } from 'react';
import './home.css';

const Home = () => {
    const [image, setImage] = useState("");
    const [image2, setImage2] = useState("");
    const [blob, setblob] = useState();
    // console.log("blobl printing", blob);

    const handleTask = async () => {
        const formD = new FormData();
        formD.append('size', 'auto');
        // formD.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
        formD.append('image_file', blob);
        console.log('called');
        // handletask
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
            console.log("fetched Res", res);
            var arrayBufferView = new Uint8Array(res.data);
            var blob = new Blob([arrayBufferView], { type: "image/png" });
            console.log("server fetched blob", blob);
            setImage2(URL.createObjectURL(blob));
            console.log('COMPLETED');
        }).catch((err) => console.log("Error OCCured", err));
    }

    return (
        <div className='home'>
            <div className="titleContainer">
                <p className='appTitle wiggleFont'>Image BG Remover<span className='author'>-mza</span></p>
            </div>
            <div className="mainWrapper">
                <div className="imgContainer">
                    <h3>Input Image</h3>
                    <img className='image' id='photo' src={image} alt="_load_image" />
                </div>
                <div className="inputContainer">
                    <label htmlFor="image" className='pointer'>Select Image</label>
                    <input id='image' hidden type="file" accept='image/*'
                        onChange={e => {
                            setImage(URL.createObjectURL(e?.target?.files[0]));
                            setblob(e?.target?.files[0])
                        }} />
                    <div className="imgInfo">
                        <p>{blob?.name}</p>
                        <p>{blob?.type}</p>
                        <p>{parseInt(blob?.size) * 1e-6 + "MB"}</p>
                    </div>
                    <div className="submitArea">
                        <button type='button' onClick={handleTask}> Submit </button>
                    </div>
                </div>
                <div className="imgContainer">
                    <h3>Result Image</h3>
                    <img className='image' src={image2} alt="_load_image" />
                </div>
                {/* <div className="resultContainer">

                </div> */}
            </div>
        </div>
    )
}

export default Home