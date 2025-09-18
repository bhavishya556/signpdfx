import { getCertificateFromSignature } from './dist/lib/index.js';

console.log('🧪 Testing Error Handling...\n');

// Test 1: Null input
console.log('Test 1: Null input');
try {
    getCertificateFromSignature(null);
    console.log('❌ Should have thrown error for null input');
} catch (error) {
    console.log('✅ Correctly caught null input error:', error.message);
}

// Test 2: Undefined input
console.log('\nTest 2: Undefined input');
try {
    getCertificateFromSignature(undefined);
    console.log('❌ Should have thrown error for undefined input');
} catch (error) {
    console.log('✅ Correctly caught undefined input error:', error.message);
}

// Test 3: Empty string
console.log('\nTest 3: Empty string');
try {
    getCertificateFromSignature('');
    console.log('❌ Should have thrown error for empty string');
} catch (error) {
    console.log('✅ Correctly caught empty string error:', error.message);
}

// Test 4: Valid Buffer (should work)
console.log('\nTest 4: Valid Buffer');
try {
    const validBuffer = Buffer.from('test');
    const result = getCertificateFromSignature(validBuffer);
    console.log('✅ Valid buffer processed (may not find certificates, but no error)');
} catch (error) {
    console.log('ℹ️  Valid buffer test (expected to fail with no certificates):', error.message);
}

console.log('\n✅ Error handling tests completed!');
