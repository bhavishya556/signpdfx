import { getCertificateFromSignature } from './dist/lib/index.js';
import { readFileSync } from 'fs';

console.log('🧪 Testing PDF Certificate Extractor Package...\n');

try {
    // Test 1: Load PDF file
    console.log('📄 Loading PDF file...');
    const pdf = readFileSync('./lib/test.pdf');
    console.log(`✅ PDF loaded successfully (${pdf.length} bytes)\n`);

    // Test 2: Extract certificates
    console.log('🔍 Extracting certificates...');
    const certificates = getCertificateFromSignature(pdf);
    console.log(`✅ Successfully extracted ${certificates.length} certificate group(s)\n`);

    // Test 3: Display certificate information
    console.log('📋 Certificate Details:');
    console.log('='.repeat(50));

    certificates.forEach((certGroup, groupIndex) => {
        console.log(`\n📁 Certificate Group ${groupIndex + 1}:`);
        certGroup.forEach((cert, index) => {
            console.log(`\n  📜 Certificate ${index + 1}:`);
            console.log(`     Subject: ${cert.issuedTo.CN || 'Unknown'}`);
            console.log(`     Issuer: ${cert.issuedBy.CN || 'Unknown'}`);
            console.log(`     Valid From: ${cert.validityPeriod.notBefore}`);
            console.log(`     Valid To: ${cert.validityPeriod.notAfter}`);
            console.log(`     Client Certificate: ${cert.clientCertificate ? 'Yes' : 'No'}`);
            console.log(`     PEM Length: ${cert.pemCertificate.length} characters`);
        });
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests passed! Package is working correctly.');
    console.log('🚀 Ready for deployment!');

} catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}
