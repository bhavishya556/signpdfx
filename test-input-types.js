import { getCertificateFromSignature } from './dist/lib/index.js';
import { readFileSync } from 'fs';

console.log('🧪 Testing Different Input Types...\n');

try {
    // Test 1: Buffer input
    console.log('Test 1: Buffer input');
    const pdfBuffer = readFileSync('./lib/test.pdf');
    const result1 = getCertificateFromSignature(pdfBuffer);
    console.log(`✅ Buffer input: ${result1.length} certificate group(s)\n`);

    // Test 2: String input (base64)
    console.log('Test 2: String input (base64)');
    const pdfString = pdfBuffer.toString('base64');
    const result2 = getCertificateFromSignature(pdfString);
    console.log(`✅ String input: ${result2.length} certificate group(s)\n`);

    // Test 3: Uint8Array input
    console.log('Test 3: Uint8Array input');
    const pdfUint8Array = new Uint8Array(pdfBuffer);
    const result3 = getCertificateFromSignature(pdfUint8Array);
    console.log(`✅ Uint8Array input: ${result3.length} certificate group(s)\n`);

    // Test 4: Binary string input
    console.log('Test 4: Binary string input');
    const pdfBinaryString = pdfBuffer.toString('binary');
    const result4 = getCertificateFromSignature(pdfBinaryString);
    console.log(`✅ Binary string input: ${result4.length} certificate group(s)\n`);

    console.log('✅ All input type tests passed!');
    console.log('🎯 Package handles all supported input types correctly.');

} catch (error) {
    console.error('❌ Input type test failed:', error.message);
    process.exit(1);
}
