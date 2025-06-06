import axios from 'axios';
import { UserAttachment, CreateUserAttachmentParams, UpdateUserAttachmentParams } from './types';
import { serialize as objectToFormData } from 'object-to-formdata';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

const http = axios.create({
  baseURL: API_URL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchUserAttachments() {
  const { data } = await http.get<UserAttachment[]>('/user_attachments');
  return data;
}

export async function fetchUserAttachment(id: string) {
  const { data } = await http.get<UserAttachment>(`/user_attachments/${id}`);
  return data;
}

export async function createUserAttachments({
  attachments,
  title,
  note,
}: CreateUserAttachmentParams): Promise<UserAttachment[]> {
  const basicData = {
    title,
    note,
  };

  const formData = objectToFormData(basicData, {
    indices: true,
    nullsAsUndefineds: true,
    booleansAsIntegers: false,
    allowEmptyArrays: false,
  });

  attachments.forEach((file) => {
    formData.append('media', file);
  });

  const { data } = await http.post<UserAttachment[]>('/user_attachments', formData, {
    headers: {
      Accept: 'application/json',
    },
  });

  return data;
}

export async function updateUserAttachment({
  id,
  title,
  note,
}: UpdateUserAttachmentParams): Promise<UserAttachment> {
  const { data } = await http.patch<UserAttachment>(`/user_attachments/${id}`, { title, note });
  return data;
}

export async function deleteUserAttachment(id: string) {
  await http.delete(`/user_attachments/${id}`);
  return { success: true };
}
