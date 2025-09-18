import { Buffer } from '../buffer.js';
import { StringDecoder } from 'string_decoder';
import VerifyPDFError, { TYPE_PARSE } from '../VerifyPDFError.js';
import { getSignatureMeta, preparePDF } from './general.js';
import { SignatureExtractionResult } from '../types.js';

const DEFAULT_BYTE_RANGE_PLACEHOLDER = '**********';

const getSignatureFromBuffer = (textChunk: string): Buffer[] => {
    const matches = textChunk.match(/\/Contents\s+<(.*?)>/g);
    return matches ? matches.map(match => {
        const startIndex = match.indexOf('<');
        const endIndex = match.indexOf('>');
        const content = match.substring(startIndex + 1, endIndex);
        return Buffer.from(content, 'hex');
    }) : [];
};

const getByteRange = (pdfBuffer: Buffer): { byteRangePlaceholder?: string; byteRanges: number[][]; addSignatureStr: Buffer[] } => {
    const decoder = new StringDecoder('utf8');
    const textChunk = decoder.write(pdfBuffer);

    const byteRangeStrings = textChunk.match(/\/ByteRange\s*\[{1}\s*(?:(?:\d*|\/\*{10})\s+){3}(?:\d+|\/\*{10}){1}\s*\]{1}/g);

    if (!byteRangeStrings) {
        throw new VerifyPDFError(
            'Failed to locate ByteRange.',
            TYPE_PARSE,
        );
    }

    const byteRangePlaceholder = byteRangeStrings.find((s) => s.includes(`/${DEFAULT_BYTE_RANGE_PLACEHOLDER}`));
    const strByteRanges = byteRangeStrings.map((brs) => brs.match(/[^[\s]*(?:\d|\/\*{10})/g));

    const byteRanges = strByteRanges.map((n) => n ? n.map(Number) : []);

    const addSignatureStr = getSignatureFromBuffer(textChunk);

    return {
        byteRangePlaceholder,
        byteRanges,
        addSignatureStr
    };
};

const extractSignature = (pdf: Buffer | string | Uint8Array): SignatureExtractionResult => {
    const pdfBuffer = preparePDF(pdf);

    const { byteRanges, addSignatureStr } = getByteRange(pdfBuffer);
    const lastIndex = byteRanges.length - 1;
    const endOfByteRange = byteRanges[lastIndex][2] + byteRanges[lastIndex][3];

    const signatureStr: Buffer[] = [];
    const signedData: Buffer[] = [];
    byteRanges.forEach((byteRange) => {
        signedData.push(Buffer.concat([
            pdfBuffer.slice(byteRange[0], byteRange[0] + byteRange[1]),
            pdfBuffer.slice(byteRange[2], byteRange[2] + byteRange[3]),
        ]));

        const signatureHex = pdfBuffer.slice(byteRange[0] + byteRange[1] + 1, byteRange[2]).toString('latin1');
        signatureStr.push(Buffer.from(signatureHex, 'hex'));
    });

    const signatureMeta = signedData.map((sd) => getSignatureMeta(sd));

    return {
        byteRanges,
        signatureStr,
        signedData,
        signatureMeta,
        addSignatureStr
    };
};

export default extractSignature;
