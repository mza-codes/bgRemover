import { useState } from 'react';
import './home.css';

const Home = () => {
    const [image, setImage] = useState("");
    const [blob, setblob] = useState();
    console.log("blobl printing", blob);

    const handleTask = async() => {
        console.log('called');
        // handletask
    }

    return (
        <div className='home'>
            <div className="titleContainer">
                <p className='appTitle wiggleFont'>Image BG Remover<span className='author'>-mza</span></p>
            </div>
            <div className="mainWrapper">
                <div className="imgContainer">
                    <img className='image' src={image} alt="_load_image" />
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
                <div className="resultContainer">

                </div>
            </div>
        </div>
    )
}

export default Home