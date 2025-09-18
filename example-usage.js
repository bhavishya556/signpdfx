import { getCertificateFromSignature } from './dist/lib/index.js';
import { readFileSync } from 'fs';

// Example usage of the npm package
async function example() {
    try {
        // Load a PDF file
        const pdfBuffer = readFileSync('./lib/test.pdf');

        // Extract certificates from the PDF signature
        const certificates = getCertificateFromSignature(pdfBuffer);

        console.log('=== PDF Certificate Extraction ===\n');

        // Display certificate information
        certificates.forEach((certGroup, groupIndex) => {
            console.log(`--- Certificate Group ${groupIndex + 1} ---`);
            certGroup.forEach((cert, index) => {
                console.log(`\nCertificate ${index + 1}:`);
                console.log('  Subject:', cert.issuedTo.CN || 'Unknown');
                console.log('  Issuer:', cert.issuedBy.CN || 'Unknown');
                console.log('  Serial Number:', cert.validityPeriod.notBefore);
                console.log('  Valid From:', cert.validityPeriod.notBefore);
                console.log('  Valid To:', cert.validityPeriod.notAfter);
                console.log('  PEM Certificate:');
                console.log(cert.pemCertificate);
            });
        });

    } catch (error) {
        console.error('Error extracting certificates:', error.message);
    }
}

example();
