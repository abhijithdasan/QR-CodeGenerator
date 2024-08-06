import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = () => {
  const [networkName, setNetworkName] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('nopass');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');

  const handleNetworkNameChange = (e) => setNetworkName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEncryptionChange = (e) => setEncryption(e.target.value);
  const handleBgColorChange = (e) => setBgColor(e.target.value);
  const handleFgColorChange = (e) => setFgColor(e.target.value);

  const generateWifiQRCode = () => {
    const wifiString = `WIFI:T:${encryption};S:${networkName};P:${password};;`;
    return wifiString;
  };

  return (
    <div className="qr-code-generator">
      <input
        type="text"
        placeholder="Network name"
        value={networkName}
        onChange={handleNetworkNameChange}
      />
      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <select value={encryption} onChange={handleEncryptionChange}>
        <option value="nopass">No encryption</option>
        <option value="WEP">WEP</option>
        <option value="WPA">WPA/WPA2</option>
      </select>
      <div>
        <label>Background Color:</label>
        <input type="color" value={bgColor} onChange={handleBgColorChange} />
      </div>
      <div>
        <label>Foreground Color:</label>
        <input type="color" value={fgColor} onChange={handleFgColorChange} />
      </div>
      <QRCode
        value={generateWifiQRCode()}
        bgColor={bgColor}
        fgColor={fgColor}
        size={256}
      />
    </div>
  );
};

export default QRCodeGenerator;
