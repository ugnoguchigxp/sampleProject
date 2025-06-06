export interface UserAttachment {
  id: string;
  title?: string;
  note?: string;
  mediaFileName: string;
  mediaFileSize: number;
  mediaContentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserAttachmentParams {
  attachments: File[];
  title?: string;
  note?: string;
}

export interface UpdateUserAttachmentParams {
  id: string;
  title?: string;
  note?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}
