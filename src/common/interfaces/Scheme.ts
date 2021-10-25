import { AmplifyStorageLevel } from '@constants';

export interface UserEachSerializer {
  id: number;
  name: string;
  image: S3Image | null;
  email: string;
  uuid: string;
}

export interface CurrentUser {
  isAuthenticated: boolean;
  [key: string]: any;
}

export type ImageType = 'normal' | 'main';

export interface S3ImageBase {
  level: AmplifyStorageLevel;
  key: string;
  image_type: ImageType;
}

export interface S3Image extends S3ImageBase {
  id: number;
}

export interface Chatroom {
  id: string;
  user_chatrooms_count: number;
  name: string | null;
  room_type: 'single' | 'multiple';
  users: UserEachSerializer[];
}

export interface MessageType {
  id?: string;
  user_id: string;
  room_id: string;
  text: string;
  image?: string;
  view?: number;
  owner?: string;
  createdAt?: string;
  isLast?: boolean;
}
