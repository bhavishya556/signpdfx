import verifyPDF from './lib/index.js';
import { getCertificatesInfoFromPDF } from './lib/certificateDetails.js';
import { readFileSync } from 'fs';
import { CertificateDetails } from './lib/types.js';

// Example usage
const pdf = readFileSync('./lib/test.pdf');

console.log('=== PDF VERIFICATION EXAMPLE ===\n');

// Extract and display certificate information
console.log('Extracting certificates from PDF signature...');
const certificates = getCertificatesInfoFromPDF(pdf);

certificates.forEach((certGroup: CertificateDetails[], groupIndex: number) => {
    console.log(`\n--- Certificate Group ${groupIndex + 1} ---`);
    certGroup.forEach((cert: CertificateDetails, index: number) => {
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

// Verify the PDF
console.log('\n--- PDF Verification ---');
const result = verifyPDF(pdf);
console.log('Verification Result:', result);
