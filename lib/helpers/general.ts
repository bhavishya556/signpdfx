import forge from 'node-forge';
import { Buffer } from '../buffer.js';
import VerifyPDFError, { TYPE_INPUT, TYPE_PARSE, UNSUPPORTED_SUBFILTER } from '../VerifyPDFError.js';
import { SignatureMeta, CertificateInfo } from '../types.js';

export const preparePDF = (pdf: Buffer | string | Uint8Array): Buffer => {
    try {
        if (Buffer.isBuffer(pdf)) return pdf;
        return Buffer.from(pdf);
    } catch (error) {
        throw new VerifyPDFError(
            'PDF expected as Buffer.',
            TYPE_INPUT,
        );
    }
};

export const checkForSubFilter = (pdfBuffer: Buffer): void => {
    const matches = pdfBuffer.toString().match(/\/SubFilter\s*\/([\w.]*)/);
    const subFilter = Array.isArray(matches) && matches[1];
    if (!subFilter) {
        throw new VerifyPDFError(
            'cannot find subfilter',
            TYPE_PARSE,
        );
    }
    const supportedTypes = ['adbe.pkcs7.detached', 'etsi.cades.detached', 'adbe.pkcs7.sha1'];
    if (!supportedTypes.includes(subFilter.trim().toLowerCase())) {
        throw new VerifyPDFError(`subFilter ${subFilter} not supported`, UNSUPPORTED_SUBFILTER);
    }
};

export const getMessageFromSignature = (signature: Buffer | Uint8Array | string): CertificateInfo => {
    // Convert Buffer/Uint8Array to binary string for node-forge
    let signatureStr: string;
    if (Buffer.isBuffer(signature)) {
        signatureStr = signature.toString('binary');
    } else if (signature instanceof Uint8Array) {
        signatureStr = Buffer.from(signature).toString('binary');
    } else {
        signatureStr = signature;
    }

    // Remove trailing null bytes first
    let cleanedStr = signatureStr;
    for (let i = signatureStr.length - 1; i >= 0; i--) {
        if (signatureStr.charCodeAt(i) !== 0) {
            cleanedStr = signatureStr.slice(0, i + 1);
            break;
        }
    }

    // Look for certificate patterns in the data
    // X.509 certificates typically start with 0x30 0x82 (SEQUENCE with length > 255)
    const certificates: forge.pki.Certificate[] = [];
    const certPattern = /\x30\x82[\x00-\xFF]{2}/g; // SEQUENCE with 2-byte length

    let match: RegExpExecArray | null;
    while ((match = certPattern.exec(cleanedStr)) !== null) {
        const startIndex = match.index;

        // Try to extract the certificate
        try {
            // Read the length from the DER structure
            const lengthByte1 = cleanedStr.charCodeAt(startIndex + 2);
            const lengthByte2 = cleanedStr.charCodeAt(startIndex + 3);
            const certLength = (lengthByte1 << 8) | lengthByte2;
            const totalLength = certLength + 4; // Include header

            if (startIndex + totalLength <= cleanedStr.length) {
                const certData = cleanedStr.slice(startIndex, startIndex + totalLength);

                // Try to parse as X.509 certificate
                const certAsn1 = forge.asn1.fromDer(certData);
                const cert = forge.pki.certificateFromAsn1(certAsn1);
                certificates.push(cert);
            }
        } catch (error) {
            // Silently skip invalid certificate structures
        }
    }

    if (certificates.length > 0) {
        console.log(`Successfully extracted ${certificates.length} certificate(s) from PDF signature`);
        // Return a mock message object with the certificates
        return {
            certificates: certificates
        };
    }

    // Fallback to original PKCS#7 parsing if no certificates found
    try {
        const p7Asn1 = forge.asn1.fromDer(cleanedStr);
        const message = forge.pkcs7.messageFromAsn1(p7Asn1);
        return {
            certificates: (message as any).certificates || [],
            rawCapture: (message as any).rawCapture
        };
    } catch (error) {
        throw error;
    }
};

export const getMetaRegexMatch = (keyName: string) => (str: string): string | undefined => {
    const regex = new RegExp(`/${keyName}\\s*\\(([\\w.\\s@,]*)`);
    const matches = str.match(regex);
    return matches?.[1] || undefined;
};

export const getSignatureMeta = (signedData: Buffer | string): SignatureMeta => {
    const str = Buffer.isBuffer(signedData) ? signedData.toString() : signedData;
    return ({
        reason: getMetaRegexMatch('Reason')(str),
        contactInfo: getMetaRegexMatch('ContactInfo')(str),
        location: getMetaRegexMatch('Location')(str),
    });
};
