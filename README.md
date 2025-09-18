# PDF Certificate Extractor

A TypeScript npm package for extracting X.509 certificates from PDF signatures.

## Features

- Extract X.509 certificates from PDF signatures
- Support for multiple signature formats (PKCS#7, CAdES)
- TypeScript support with full type definitions
- Simple, clean API with single method
- Works with Buffer, string, or Uint8Array inputs

## Installation

```bash
npm install signpdfx
```

## Usage

```javascript
import { getCertificateFromSignature } from 'signpdfx';
import { readFileSync } from 'fs';

// Load a PDF file
const pdfBuffer = readFileSync('./signed-document.pdf');

// Extract certificates from the PDF signature
const certificates = getCertificateFromSignature(pdfBuffer);

// Display certificate information
certificates.forEach((certGroup, groupIndex) => {
  console.log(`Certificate Group ${groupIndex + 1}:`);
  certGroup.forEach((cert, index) => {
    console.log(`Certificate ${index + 1}:`);
    console.log('Subject:', cert.issuedTo.CN);
    console.log('Issuer:', cert.issuedBy.CN);
    console.log('Valid From:', cert.validityPeriod.notBefore);
    console.log('Valid To:', cert.validityPeriod.notAfter);
    console.log('PEM:', cert.pemCertificate);
  });
});
```

## API Reference

### `getCertificateFromSignature(pdf)`

Extracts X.509 certificates from a PDF signature.

**Parameters:**
- `pdf` (Buffer | string | Uint8Array): The PDF file as a buffer, string, or Uint8Array

**Returns:**
- `CertificateDetails[][]`: Array of certificate groups, each containing certificate details

**Example:**
```typescript
import { getCertificateFromSignature } from 'signpdfx';

const pdfBuffer = Buffer.from(pdfData);
const certificates = getCertificateFromSignature(pdfBuffer);
```

### Certificate Information

The function returns detailed certificate information:

```typescript
interface CertificateDetails {
  issuedBy: Record<string, any>;        // Certificate issuer details
  issuedTo: Record<string, any>;        // Certificate subject details
  validityPeriod: {
    notBefore: Date;                    // Certificate valid from
    notAfter: Date;                     // Certificate valid to
  };
  pemCertificate: string;               // Full PEM certificate
  clientCertificate?: boolean;          // True for end-user certificates
}
```

## Supported PDF Signature Types

- `adbe.pkcs7.detached` - Adobe PKCS#7 detached signatures
- `etsi.cades.detached` - ETSI CAdES detached signatures  
- `adbe.pkcs7.sha1` - Adobe PKCS#7 SHA-1 signatures

## Development

### Building the Package

```bash
npm run build
```

### Testing Locally

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Test with example
npm run example
```

### Publishing to NPM

1. Update the version in `package.json`
2. Build the package: `npm run build`
3. Publish: `npm publish`

## Dependencies

- **node-forge**: Cryptographic operations and certificate parsing
- **base64-js**: Base64 encoding/decoding
- **ieee754**: IEEE 754 floating point operations

## Error Handling

The package provides comprehensive error handling for:

- Invalid PDF input data
- PDF parsing errors
- Byte range extraction errors
- Unsupported signature types

## License

MIT
