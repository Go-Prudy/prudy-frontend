export interface Notification {
  id: string;
  title: string;
  message: string;
  metadata: null;
  status: 'read' | 'unread';
  createdAt: string;
  updatedAt: string;
}
