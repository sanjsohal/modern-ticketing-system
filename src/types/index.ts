export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'agent' | 'customer' | 'USER';
};

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketCategory = 
  | 'TECHNICAL_SUPPORT' 
  | 'BILLING' 
  | 'GENERAL_INQUIRY' 
  | 'FEATURE_REQUEST' 
  | 'BUG_REPORT';

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