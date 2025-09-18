import * as forge from 'node-forge';

export interface VerifyPDFResult {
    verified: boolean;
    authenticity: boolean;
    integrity: boolean;
    expired: boolean;
    signatures?: Array<{
        verified: boolean;
        authenticity: boolean;
        integrity: boolean;
        expired: boolean;
        meta: {
            certs: CertificateDetails[];
            signatureMeta: SignatureMeta;
        };
    }>;
    message?: string;
    error?: any;
}

export interface CertificateDetails {
    issuedBy: Record<string, any>;
    issuedTo: Record<string, any>;
    validityPeriod: {
        notBefore: Date;
        notAfter: Date;
    };
    pemCertificate: string;
    clientCertificate?: boolean;
}

export interface SignatureMeta {
    reason?: string;
    contactInfo?: string;
    location?: string;
}

export interface ByteRange {
    byteRangePlaceholder?: string;
    byteRanges: number[][];
    addSignatureStr: Buffer[];
}

export interface SignatureExtractionResult {
    byteRanges: number[][];
    signatureStr: any[];
    signedData: any[];
    signatureMeta: SignatureMeta[];
    addSignatureStr: any[];
}

export interface CertificateInfo {
    certificates: forge.pki.Certificate[];
    rawCapture?: {
        signature: string;
        authenticatedAttributes: any[];
        digestAlgorithm: any;
    };
}
