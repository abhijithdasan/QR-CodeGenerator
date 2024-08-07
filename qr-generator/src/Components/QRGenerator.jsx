import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import htmlToImage from 'html-to-image'; // Import html-to-image for downloads
import './QRGenerator.css'; // Import QRGenerator-specific styles
import '../App.css'; // Import App-wide styles

const QRGenerator = () => {
  const [mode, setMode] = useState('links'); // 'links' or 'wifi'
  const [input, setInput] = useState('');
  const [logo, setLogo] = useState(null); // State to manage logo
  const qrRef = useRef(null); // Ref to access QR code container

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const getQRValue = () => {
    if (mode === 'links') {
      return input;
    }
    // Construct WiFi QR code format
    return `WIFI:S:${input.ssid};T:${input.encryption};P:${input.password};;`;
  };

  const downloadQRCode = async (format) => {
    if (qrRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(qrRef.current); // Convert QR code to PNG
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qr-code.${format}`;
        link.click();
      } catch (error) {
        console.error('Error downloading QR code:', error);
      }
    }
  };

  const shareQRCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QR Code',
        text: 'Check out this QR code!',
        url: qrRef.current ? qrRef.current.toDataURL() : '',
      }).catch(console.error);
    } else {
      alert('Sharing not supported on this browser.'); // Fallback
    }
  };

  return (
    <div className="qr-code-generator">
      <div className="qr-code-types">
        <button
          className={`mode-button ${mode === 'links' ? 'active' : ''}`}
          onClick={() => handleModeChange('links')}
        >
          Links
        </button>
        <button
          className={`mode-button ${mode === 'wifi' ? 'active' : ''}`}
          onClick={() => handleModeChange('wifi')}
        >
          WiFi
        </button>
      </div>

      <div className="input-section">
        {mode === 'links' && (
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter link, number, or text"
              value={input}
              onChange={handleInputChange}
            />
          </div>
        )}
        {mode === 'wifi' && (
          <div className="input-container">
            <input
              type="text"
              placeholder="SSID"
              onChange={(e) => setInput({ ...input, ssid: e.target.value })}
            />
            <input
              type="text"
              placeholder="Password"
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
            <select
              onChange={(e) => setInput({ ...input, encryption: e.target.value })}
            >
              <option value="WEP">WEP</option>
              <option value="WPA">WPA</option>
              <option value="nopass">No password</option>
            </select>
          </div>
        )}
      </div>

      <div className="logo-upload">
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
      </div>

      <div className="qr-code-container" ref={qrRef}>
        <QRCode
          value={getQRValue()}
          size={256}
          includeMargin={true}
          renderAs="svg"
          imageSettings={logo ? { src: logo, height: 60, width: 60, excavate: true } : null}
        />
      </div>

      <div className="download-buttons">
        <button onClick={() => downloadQRCode('png')}>Download PNG</button>
        <button onClick={() => downloadQRCode('jpg')}>Download JPG</button>
        <button onClick={() => downloadQRCode('svg')}>Download SVG</button>
        <button onClick={shareQRCode}>Share</button>
      </div>
    </div>
  );
};

export default QRGenerator;
