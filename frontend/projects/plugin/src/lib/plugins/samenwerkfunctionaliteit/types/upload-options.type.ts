import { DocumentType } from '@valtimo/document';

export type UploadOptions =
    | {
        uploadToDocumentenApi: true;
        documentTypes: DocumentType[];
    }
    | {
        uploadToDocumentenApi: false;
        documentTypes?: DocumentType[];
    };