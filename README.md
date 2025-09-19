# signpdfx

Extract X.509 certificates from PDF signatures

## Installation

```bash
npm install signpdfx
```

## Usage

```javascript
import { getCertificates } from 'signpdfx';
import { readFileSync } from 'fs';

const pdfBuffer = readFileSync('signed-document.pdf');
const certificates = getCertificates(pdfBuffer);

console.log('Found', certificates.length, 'certificates');
certificates.forEach((cert, index) => {
    console.log(`Certificate ${index + 1}:`);
    console.log('Subject:', cert.issuedTo.CN);
    console.log('Issuer:', cert.issuedBy.CN);
    console.log('Certificate Data:', cert.certificateData);
});
```

## API

### `getCertificates(pdf)`

Extract certificates from PDF buffer.

**Parameters:**
- `pdf` - PDF buffer

**Returns:** Array of certificate objects

## Certificate Object Structure

```json
{
  "clientCertificate": true,
  "issuedBy": { "commonName": "Issuer Name" },
  "issuedTo": { "commonName": "Subject Name" },
  "validityPeriod": {
    "notBefore": "2023-01-01T00:00:00.000Z",
    "notAfter": "2024-01-01T00:00:00.000Z"
  },
  "certificateData": "MIIEpjCCA46gAwIBAgIGAVif/3RzMA0GCSqGSIb3DQEBCwUAMIGLMR4wHAYDVQQH..."
}
```

## License

MIT