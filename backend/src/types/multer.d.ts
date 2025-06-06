declare namespace Express {
  export interface Request {
    file?: Multer.File;
    files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
  }
}

declare namespace Multer {
  export interface File {
    /** Name of the field associated with this file */
    fieldname: string;
    /** Name of the file on the uploader's computer */
    originalname: string;
    /** Encoding type of the file */
    encoding: string;
    /** MIME type of the file */
    mimetype: string;
    /** Size of the file in bytes */
    size: number;
    /** `DiskStorage` only: Directory to which the file has been uploaded */
    destination: string;
    /** `DiskStorage` only: Name of the file within `destination` */
    filename: string;
    /** `DiskStorage` only: Full path to the uploaded file */
    path: string;
    /** `MemoryStorage` only: A Buffer containing the entire file */
    buffer: Buffer;
  }
}
