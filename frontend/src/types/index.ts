export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    posts: number;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  category: {
    id: string;
    name: string;
  };
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}