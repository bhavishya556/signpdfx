# PDF Certificate Extractor - NPM Package

## 🎉 Your NPM Package is Ready!

Your TypeScript codebase has been successfully converted into a clean, publishable npm package.

## Package Details

- **Name**: `pdx`
- **Version**: `1.0.0`
- **Main Export**: `getCertificateFromSignature(pdf)`
- **TypeScript Support**: ✅ Full type definitions included
- **Node.js Support**: >=16.0.0

## Quick Start

### Installation
```bash
npm install pdx
```

### Usage
```javascript
import { getCertificateFromSignature } from 'pdx';
import { readFileSync } from 'fs';

// Load a PDF file
const pdfBuffer = readFileSync('./signed-document.pdf');

// Extract certificates
const certificates = getCertificateFromSignature(pdfBuffer);

// Display results
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

## Package Structure

```
dist/lib/
├── index.js              # Main entry point
├── index.d.ts            # TypeScript definitions
├── certificateDetails.js # Certificate extraction logic
├── buffer.js             # Buffer implementation
├── types.js              # Type definitions
├── verifyPDF.js          # PDF verification (internal)
├── VerifyPDFError.js     # Error handling
└── helpers/              # Helper functions
    ├── general.js
    ├── extractSignature.js
    ├── certsUtils.js
    ├── verification.js
    └── rootCAs.json
```

## Publishing to NPM

### 1. Update Package Information
Edit `package.json` to update:
- `author`: Your name/email
- `repository.url`: Your GitHub repository
- `bugs.url`: Your GitHub issues page
- `homepage`: Your package homepage

### 2. Build the Package
```bash
npm run build
```

### 3. Test Locally
```bash
# Test the built package
node example-usage.js
```

### 4. Publish to NPM
```bash
# Login to NPM (if not already logged in)
npm login

# Publish the package
npm publish
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Build and run development version
- `npm run example` - Build and run example
- `npm run clean` - Remove dist folder
- `npm run jadu` - Your custom build + start command

## Features

✅ **Single Method Export**: Clean API with just `getCertificateFromSignature()`
✅ **TypeScript Support**: Full type definitions included
✅ **Multiple Input Types**: Accepts Buffer, string, or Uint8Array
✅ **Comprehensive Output**: Complete certificate details with PEM format
✅ **Error Handling**: Robust error handling for various edge cases
✅ **Clean Structure**: Well-organized, maintainable codebase

## Supported PDF Signature Types

- `adbe.pkcs7.detached` - Adobe PKCS#7 detached signatures
- `etsi.cades.detached` - ETSI CAdES detached signatures  
- `adbe.pkcs7.sha1` - Adobe PKCS#7 SHA-1 signatures

## Dependencies

- `node-forge` - Cryptographic operations
- `base64-js` - Base64 encoding/decoding
- `ieee754` - IEEE 754 floating point operations

## License

MIT

---

## Next Steps

1. **Update package.json** with your information
2. **Test the package** thoroughly with different PDFs
3. **Publish to NPM** when ready
4. **Create GitHub repository** for the package
5. **Add more examples** and documentation as needed

Your npm package is ready to go! 🚀
