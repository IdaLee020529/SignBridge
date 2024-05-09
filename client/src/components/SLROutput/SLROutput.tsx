import './SLROutput.css';

const SLROutput = ({ responseData }: { responseData: string | null }) => {
    return (
        <div className="slr-output-container">
            <h1>SLR Model Output</h1>
            {responseData ? (
                <div className="output-content">
                    <p>Received Output: {responseData}</p>
                </div>
            ) : (
                <div className="output-content">
                    <p>No Output Available</p>
                </div>
            )}
        </div>
    );
}

export default SLROutput;