import "./Loader.css";

const Loader = ({ color }) => {

    return (
        <div className="lds-facebook">
            <div style={{ background: color ?? "#111" }} />
            <div style={{ background: color ?? "#111" }} />
            <div style={{ background: color ?? "#111" }} />
        </div>
    );
};

export default Loader;