import React, {useEffect, useState} from "react";
import { Navigate } from "react-router-dom";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import InputWithSuggestions from "../components/package/inputWithSuggestions";
import InputBid from "../components/package/inputBid";
import KeyboardSuggestions from "../components/package/keyboardSuggestions";

import Header from "../components/common/header";

import api from '../../public/global/config/api';
import wsConfig from '../../public/global/config/wss';
console.log('wsConfig', wsConfig);

import './styles/dashboard.css';

function BidControls({keyboardSuggestions, setKeyboardSuggestions, magnitude, setMagnitude}){
    const [advancedControls, setAdvancedControls] = useState(false);
    const [suggestions, setSuggestions] = useState(keyboardSuggestions);

    const magnitudes = {
        'M': 'Millones',
        'K': 'Miles',
        'B': 'Billones',
    }

    const handleAdvancedControls = (event) => {
        setAdvancedControls(event.target.checked);
    }

    useEffect(() => {
        setKeyboardSuggestions(suggestions);
    }, [suggestions]);

    const handleSuggestionChange = (event, index) => {
        const value = event.target.value;
        setSuggestions(prevSuggestions => {
            const newSuggestions = [...prevSuggestions];
            newSuggestions[index] = value;
            return newSuggestions;
        });
    }

    const Controls = () => {
        return (
            <div className="bid-advanced-controls-controls">
                <div className="bid-controller">
                    <p>Editar Atajos de puja</p>
                    <div className="keyboard-suggestions-controller">
                        {
                            keyboardSuggestions && keyboardSuggestions.map((suggestion, index) => (
                                <input key={index} 
                                    type="number" 
                                    placeholder={'Atajo'} 
                                    value={suggestions[index]}
                                    onChange={(event) => {handleSuggestionChange(event, index)}}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className="bid-controller">
                    <p>Editar unidades de puja</p>
                    <div className="keyboard-suggestions-controller">
                        <p>Unidad actual: <b>{`${magnitude} (${magnitudes[magnitude]})`}</b></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
			<div className="bid-advanced-controls add-bid-container">
				<FormGroup>
                    <FormControlLabel control={<Switch defaultChecked={advancedControls} onChange={handleAdvancedControls}/>} label="Controles Avanzados" />
                </FormGroup>
                {
                    advancedControls && (
                        <Controls></Controls>
                    )
                }
			</div>
		);
}

function AddBid({
	handleBid,
	setBid,
	setPallete,
	mathBid,
	palleteSuggestions,
	keyboardSuggestions,
	magnitude = "M",
	status = "",
	statusColor = "",
	statusVisible = false,
    handleReset
}) {

    const handleBidChange = async (event, value) => {
        event.preventDefault();
        setBid(value);
    }

    const keyboardCallback = (event, value) => {
        console.log('keyboardCallback', value);
        event.preventDefault();
        setBid(value);
    }

	const Status = ({ status, statusColor }) => {
		return (
			<div className="add-bid-status" style={{ color: statusColor }}>
				<p>{status}</p>
			</div>
		);
	};

	return (
		<>
			<div className="add-bid-container">
                <div className="add-bid-container-header">
                    <h2>Nueva Puja</h2>
                    <button onClick={handleReset}>Reset</button>
                </div>
				<div className="add-bid-controls">
					<InputWithSuggestions
						handler={setPallete}
						suggestions={palleteSuggestions}
					></InputWithSuggestions>
					<InputBid
						handler={setBid}
						magnitude="M"
						handleBid={handleBidChange}
					></InputBid>
				</div>
				<KeyboardSuggestions
					suggestions={keyboardSuggestions}
                    mathBid={mathBid}
                    callback={keyboardCallback}
				></KeyboardSuggestions>
				
                {statusVisible && (
					<Status status={status} statusColor={statusColor}></Status>
				)}
			</div>
		</>
	);
}

function PreviewBid({pallete, bid}){
    return (
        <>
            <div className="preview-bid-container add-bid-container">
                <h2>Puja actual</h2>
                <div className="preview-bid">
                    <div className="preview-bid-pallete">
                        <p>{pallete}</p>
                        <label>Paleta</label>
                    </div>
                    <div>
                        <p>{`${bid}M`}</p>
                        <label>Puja</label>
                    </div>
                </div>
            </div>
        </>
    )
}

function Dashboard(){
    const [suggestions, setSuggestions] = useState([]);
    const [addBidKey, setAddBidKey] = useState(new Date().getTime());
    const [pallete, setPallete] = useState("0");
    const [bid, setBid] = useState("0");
    const [dbPallete, setDbPallete] = useState("0");
    const [dbBid, setDbBid] = useState("0");
    const [mathBid, setMathBid] = useState(0);
    const [palleteSuggestions, setPalleteSuggestions] = useState([]);
    const [keyboardSuggestions, setKeyboardSuggestions] = useState([1, 2, 5, 10]);
    const [magnitude, setMagnitude] = useState('M');

    useEffect(() => {
        handleBid();
    }, [bid]);

    useEffect(() => {
        const target = dbBid.replace('M', '');
        setMathBid(parseFloat(target));
    }, [dbBid]);

    useEffect(() => {
        const fetchCurrentBid = async () => {
            const response = await fetch(`${api.endpoint}/cache/bid`);
            if (response.ok) {
                const data = await response.json();
                const [onPallete, onBid] = data.value.split('@');
                setDbPallete(onPallete);
                setDbBid(onBid);
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
                const [onPallete, onBid] = data.value.split('@');
                setDbPallete(onPallete);
                setDbBid(onBid);

                if (!palleteSuggestions.includes(pallete)) {
                    setPalleteSuggestions(prevSuggestions => {
                        if (!prevSuggestions.includes(onPallete)) {
                            return [...prevSuggestions, onPallete];
                        }
                        return prevSuggestions;
                    });
                }
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

    const handleBid = async () => {
        if(bid === '' || parseFloat(bid) <= 0){
            console.log('Pallete or bid is empty');
            return;
        }
        const toSendPallet = pallete == '' ? '?' : pallete;
        const response = await fetch(`${api.endpoint}/cache`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                key: 'bid',
                value: `${toSendPallet}@${bid}`
            }),
        });

        if (response.ok) {
            setPallete('');
            setBid('');
            setAddBidKey(new Date().getTime());
        }
    }

    const handleReset = async () => {
        setPallete('');
        setBid('');
        const response = await fetch(`${api.endpoint}/cache`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                key: 'bid',
                value: `0@0`
            }),
        });
    }

    return (
        <>
            <Header title={'Panel de control'}>
                <div className="dashboard">
                    <BidControls
                        keyboardSuggestions={keyboardSuggestions}
                        setKeyboardSuggestions={setKeyboardSuggestions}
                        magnitude={magnitude}
                        setMagnitude={setMagnitude}
                    ></BidControls>
                    <AddBid 
                        handleBid={handleBid}
                        setBid={setBid}
                        setPallete={setPallete}    
                        key={addBidKey}
                        mathBid={mathBid}
                        palleteSuggestions={palleteSuggestions}
                        keyboardSuggestions={keyboardSuggestions}
                        magnitude={magnitude}
                        handleReset={handleReset}
                    ></AddBid>
                    <PreviewBid pallete={dbPallete} bid={dbBid}/>
                </div>
            </Header>
        </>
       
    );
}

export default Dashboard;