import React, {useState, useEffect} from "react";

import './styles/live-preview.css';

import api from '../../public/global/config/api';
import wsConfig from '../../public/global/config/wss';

const palleteImage = 'https://cdn.trianametria.com/media/images/pallete.png';

function LivePreview({}) {
    const [pallete, setPallete] = useState('');
    const [bid, setBid] = useState('');
    const [render, setRender] = useState(new Date());

    useEffect(() => {
        const fetchCurrentBid = async () => {
            const response = await fetch(`${api.endpoint}/cache/bid`);
            if (response.ok) {
                const data = await response.json();
                const [pallete, bid] = data.value.split('@');
                setPallete(pallete);
                setBid(bid);
            }
        }

        fetchCurrentBid();

        const ws = new WebSocket(`${wsConfig.path}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === 'cacheChange' && data.key === 'bid') {
                const [pallete, bid] = data.value.split('@');
                setPallete(pallete);
                setBid(bid);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        setRender(new Date());
    }, [pallete, bid]);

    if(!pallete || !bid || pallete == 0 || bid == 0){
        return null;
    }

    return (
        <div className="live-preview-pallete">
            <img src={palleteImage} alt="" />
            <p className="live-preview-pallete-number" key={`pallete-${render}`}>{pallete}</p>
            <p className="live-preview-bid" key={`bid-${render}`}>{`$${bid}M`}</p>
        </div>
    );
}

export default LivePreview;