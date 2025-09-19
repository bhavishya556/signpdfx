import forge from 'node-forge';
import {
    extractSignature,
    getMessageFromSignature,
    preparePDF,
} from './helpers/index.js';
import { CertificateDetails } from './types.js';

const mapEntityAttributes = (attrs: forge.pki.CertificateField[]): Record<string, any> =>
    attrs.reduce((agg, { name, value }) => {
        if (!name) return agg;
        agg[name] = value;
        return agg;
    }, {} as Record<string, any>);

const extractSingleCertificateDetails = (cert: forge.pki.Certificate): CertificateDetails => {
    const { issuer, subject, validity } = cert;
    const pemCertificate = forge.pki.certificateToPem(cert);

    // Extract clean base64 certificate data without headers


    return {
        issuedBy: mapEntityAttributes(issuer.attributes),
        issuedTo: mapEntityAttributes(subject.attributes),
        validityPeriod: validity,
        certificateData: pemCertificate,

    };
};

export const extractCertificatesDetails = (certs: forge.pki.Certificate[]): CertificateDetails[] => certs
    .map(extractSingleCertificateDetails)
    .map((cert, i) => {
        if (i) return cert;
        return {
            clientCertificate: true,
            ...cert,
        };
    });

const getCertificateFromSignature = (signature: Buffer | Uint8Array | string): CertificateDetails[] => {
    try {
        const { certificates } = getMessageFromSignature(signature);
        //console.log('\n=== CERTIFICATE DETAILS ===');
        certificates.forEach((cert, index) => {
            //console.log(`\nCertificate ${index + 1}:`);
            //console.log('  Subject:', cert.subject.getField('CN')?.value || 'Unknown');
            //console.log('  Issuer:', cert.issuer.getField('CN')?.value || 'Unknown');
            //console.log('  Serial Number:', cert.serialNumber);
            //console.log('  Valid From:', cert.validity.notBefore);
            //console.log('  Valid To:', cert.validity.notAfter);
            //console.log('  PEM Certificate:');
            //console.log(forge.pki.certificateToPem(cert));
            //console.log('  Public Key Algorithm:', cert.siginfo.algorithmOid);
        });
        //console.log('============================\n');

        return extractCertificatesDetails(certificates);
    } catch (e) {
        //console.log('Error extracting certificates:', (e as Error).message);
        throw new Error('Error extracting certificates details');
    }
};

export const getCertificatesInfoFromPDF = (pdf: Buffer | string | Uint8Array): CertificateDetails[] => {
    const pdfBuffer = preparePDF(pdf);
    const { signatureStr, addSignatureStr } = extractSignature(pdfBuffer);

    try {
        return signatureStr.flatMap(getCertificateFromSignature);
    } catch (e) {
        return addSignatureStr.flatMap(getCertificateFromSignature);
    }
};

