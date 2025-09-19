import { getCertificates } from './dist/lib/index.js';
import { readFileSync } from 'fs';

// Simple usage - give buffer and get certificates
const pdfBuffer = readFileSync('./lib/test21.pdf');
const certificates = getCertificates(pdfBuffer);

console.log('Found', certificates.length, 'certificates');

// Each certificate is a simple object
certificates.forEach((cert, index) => {
    console.log(`\nCertificate ${index + 1}:`);
    console.log('Subject:', cert.issuedTo.CN || 'Unknown');
    console.log('Issuer:', cert.issuedBy.CN || 'Unknown');
    console.log('Valid From:', cert.validityPeriod.notBefore);
    console.log('Valid To:', cert.validityPeriod.notAfter);
    console.log('Certificate Data:', cert.certificateData);
});
