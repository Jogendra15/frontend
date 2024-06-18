import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const WebCam: React.FC = () => {
    const webcamSenderRef = useRef<Webcam>(null);
    const [receivedFrame, setReceivedFrame] = useState<string | null>(null);
    const intervalRef = useRef<number | null>(null);

    const captureFrame = () => {
        if (webcamSenderRef.current) {
            const imageSrc = webcamSenderRef.current.getScreenshot();
            if (imageSrc) {
                sendFrameToBackend(imageSrc);
            }
        }
    };

    const sendFrameToBackend = async (frame: string) => {
        try {
            const response = await fetch('YOUR_BACKEND_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ frame }),
            });
            const data = await response.json();
            if (data && data.processedFrame) {
                setReceivedFrame(data.processedFrame);
            }
        } catch (error) {
            console.error('Error sending frame to backend:', error);
        }
    };

    useEffect(() => {
        intervalRef.current = window.setInterval(captureFrame, 1000 / 30); // 30 FPS
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className='container'>
            <div className="row">
                <div className="col-xl-6">
                    <Webcam
                        height={600}
                        width={600}
                        ref={webcamSenderRef}
                        screenshotFormat="image/jpeg"
                        screenshotQuality={0.8}
                        className="webcam"
                    />
                </div>
                <div className="col-xl-6">
                    {receivedFrame ? (
                        <img src={receivedFrame} alt="Received Frame" height={600} width={600} className="webcam" />
                    ) : (
                        <div style={{ height: 600, width: 600, backgroundColor: 'black' }} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default WebCam;
