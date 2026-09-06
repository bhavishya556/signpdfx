'use strict';

const forge = require('node-forge');

/**
 * Builds a self-signed X.509 certificate for use in tests.
 * @param {{ cn?: string, notBefore?: Date, notAfter?: Date }} [options]
 * @returns {{ cert: import('node-forge').pki.Certificate, pem: string }}
 */
const makeSelfSignedCert = ({
    cn = 'Test Certificate',
    notBefore = new Date(Date.now() - 24 * 60 * 60 * 1000),
    notAfter = new Date(Date.now() + 24 * 60 * 60 * 1000),
} = {}) => {
    const keys = forge.pki.rsa.generateKeyPair(1024);
    const cert = forge.pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = notBefore;
    cert.validity.notAfter = notAfter;

    const attrs = [{ name: 'commonName', value: cn }, { name: 'countryName', value: 'US' }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);

    return { cert, pem: forge.pki.certificateToPem(cert) };
};

module.exports = { makeSelfSignedCert };
