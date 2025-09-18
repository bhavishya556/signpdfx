import { getCertificatesInfoFromPDF } from './certificateDetails.js';

/**
 * Extract certificate information from a PDF signature
 * @param pdf - PDF buffer, string, or Uint8Array
 * @returns Array of certificate groups, each containing certificate details
 */
export const getCertificateFromSignature = (pdf: Buffer | string | Uint8Array) => {
    if (!pdf) {
        throw new Error('PDF ka buffer bhej bhai');
    }
    return getCertificatesInfoFromPDF(pdf);
};

// Re-export the main function as default
export default getCertificateFromSignature;
