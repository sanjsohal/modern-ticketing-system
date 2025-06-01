export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'agent' | 'customer';
};

export type TicketStatus = 'new' | 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 
  | 'technical' 
  | 'billing' 
  | 'general' 
  | 'feature_request' 
  | 'bug_report';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  assignedTo: string | null; // User ID
  comments: Comment[];
  attachments: Attachment[];
};

export type Comment = {
  id: string;
  ticketId: string;
  content: string;
  createdAt: Date;
  createdBy: string; // User ID
  isInternal: boolean;
};

export type Attachment = {
  id: string;
  ticketId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  uploadedBy: string; // User ID
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string; // User ID
  published: boolean;
  viewCount: number;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  linkTo: string;
};