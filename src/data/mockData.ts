import { Ticket, User, KnowledgeArticle, Notification } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Admin',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'admin',
  },
  {
    id: 'user-2',
    name: 'Sarah Agent',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'agent',
  },
  {
    id: 'user-3',
    name: 'Mike Agent',
    email: 'mike@example.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'agent',
  },
  {
    id: 'user-4',
    name: 'Emma Customer',
    email: 'emma@example.com',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'customer',
  },
  {
    id: 'user-5',
    name: 'Alex Customer',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'customer',
  },
];

// Mock Tickets
export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Cannot access my account',
    description: 'I am unable to login to my account despite using the correct password. Please help!',
    status: 'open',
    priority: 'high',
    category: 'technical',
    createdAt: new Date(2024, 4, 15, 9, 30),
    updatedAt: new Date(2024, 4, 15, 10, 45),
    createdBy: 'user-4',
    assignedTo: 'user-2',
    comments: [
      {
        id: 'comment-1',
        ticketId: 'ticket-1',
        content: 'I have tried resetting my password but still no luck',
        createdAt: new Date(2024, 4, 15, 10, 0),
        createdBy: 'user-4',
        isInternal: false,
      },
      {
        id: 'comment-2',
        ticketId: 'ticket-1',
        content: 'Have you cleared your browser cache?',
        createdAt: new Date(2024, 4, 15, 10, 45),
        createdBy: 'user-2',
        isInternal: false,
      },
    ],
    attachments: [
      {
        id: 'attachment-1',
        ticketId: 'ticket-1',
        filename: 'error_screenshot.png',
        url: 'https://example.com/attachments/error_screenshot.png',
        size: 256000,
        mimeType: 'image/png',
        uploadedAt: new Date(2024, 4, 15, 9, 35),
        uploadedBy: 'user-4',
      },
    ],
  },
  {
    id: 'ticket-2',
    title: 'Billing issue with my subscription',
    description: 'I was charged twice for my monthly subscription. Please refund the extra charge.',
    status: 'pending',
    priority: 'medium',
    category: 'billing',
    createdAt: new Date(2024, 4, 14, 15, 20),
    updatedAt: new Date(2024, 4, 15, 11, 0),
    createdBy: 'user-5',
    assignedTo: 'user-3',
    comments: [
      {
        id: 'comment-3',
        ticketId: 'ticket-2',
        content: 'I have checked your account and confirmed the double charge. Will process refund.',
        createdAt: new Date(2024, 4, 15, 11, 0),
        createdBy: 'user-3',
        isInternal: false,
      },
      {
        id: 'comment-4',
        ticketId: 'ticket-2',
        content: 'Need to check with finance department for approval',
        createdAt: new Date(2024, 4, 15, 11, 5),
        createdBy: 'user-3',
        isInternal: true,
      },
    ],
    attachments: [],
  },
  {
    id: 'ticket-3',
    title: 'Feature request: Dark mode',
    description: 'Would love to see a dark mode option added to the dashboard for better visibility at night.',
    status: 'new',
    priority: 'low',
    category: 'feature_request',
    createdAt: new Date(2024, 4, 16, 8, 15),
    updatedAt: new Date(2024, 4, 16, 8, 15),
    createdBy: 'user-4',
    assignedTo: null,
    comments: [],
    attachments: [],
  },
  {
    id: 'ticket-4',
    title: 'App crashes on startup',
    description: 'After the latest update, the mobile app crashes immediately when I try to open it. I\'m using iPhone 14 Pro with iOS 17.',
    status: 'open',
    priority: 'urgent',
    category: 'bug_report',
    createdAt: new Date(2024, 4, 16, 7, 45),
    updatedAt: new Date(2024, 4, 16, 9, 30),
    createdBy: 'user-5',
    assignedTo: 'user-2',
    comments: [
      {
        id: 'comment-5',
        ticketId: 'ticket-4',
        content: 'Can you please let us know which version of the app you\'re using?',
        createdAt: new Date(2024, 4, 16, 9, 30),
        createdBy: 'user-2',
        isInternal: false,
      },
    ],
    attachments: [],
  },
  {
    id: 'ticket-5',
    title: 'Question about premium features',
    description: 'I\'m considering upgrading to premium. Can you explain what additional features I would get?',
    status: 'resolved',
    priority: 'medium',
    category: 'general',
    createdAt: new Date(2024, 4, 13, 14, 0),
    updatedAt: new Date(2024, 4, 14, 10, 15),
    createdBy: 'user-4',
    assignedTo: 'user-3',
    comments: [
      {
        id: 'comment-6',
        ticketId: 'ticket-5',
        content: 'Premium includes unlimited storage, priority support, and advanced reporting features. Would you like me to send you our comparison chart?',
        createdAt: new Date(2024, 4, 14, 9, 45),
        createdBy: 'user-3',
        isInternal: false,
      },
      {
        id: 'comment-7',
        ticketId: 'ticket-5',
        content: 'Yes, that would be helpful. Thank you!',
        createdAt: new Date(2024, 4, 14, 10, 0),
        createdBy: 'user-4',
        isInternal: false,
      },
      {
        id: 'comment-8',
        ticketId: 'ticket-5',
        content: 'I\'ve sent the comparison chart to your email. Let me know if you have any other questions!',
        createdAt: new Date(2024, 4, 14, 10, 15),
        createdBy: 'user-3',
        isInternal: false,
      },
    ],
    attachments: [],
  },
];

// Mock Knowledge Base Articles
export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'article-1',
    title: 'How to Reset Your Password',
    content: `# How to Reset Your Password

Follow these simple steps to reset your password:

1. Click on the "Forgot Password" link on the login page
2. Enter your email address
3. Check your email for a password reset link
4. Click the link and follow the instructions to create a new password

If you don't receive the email within a few minutes, check your spam folder or contact support.`,
    category: 'Account Management',
    tags: ['password', 'login', 'account'],
    createdAt: new Date(2024, 3, 10),
    updatedAt: new Date(2024, 3, 10),
    author: 'user-1',
    published: true,
    viewCount: 156,
  },
  {
    id: 'article-2',
    title: 'Understanding Billing Cycles',
    content: `# Understanding Billing Cycles

Your billing cycle begins on the date you subscribe to our service. Here's what you need to know:

- Monthly subscriptions are charged every 30 days
- Annual subscriptions are charged once per year
- You can view your next billing date in your account settings
- We send email reminders 3 days before charging your account

For any billing questions, please contact our billing department.`,
    category: 'Billing',
    tags: ['billing', 'subscription', 'payment'],
    createdAt: new Date(2024, 3, 15),
    updatedAt: new Date(2024, 4, 2),
    author: 'user-1',
    published: true,
    viewCount: 89,
  },
  {
    id: 'article-3',
    title: 'Getting Started Guide',
    content: `# Getting Started Guide

Welcome to our platform! Here's how to get started:

1. Complete your profile setup
2. Explore the dashboard
3. Connect your first integration
4. Set up your team members
5. Customize your workspace

Check out our video tutorials for more detailed guidance on each step.`,
    category: 'Getting Started',
    tags: ['onboarding', 'setup', 'beginner'],
    createdAt: new Date(2024, 3, 5),
    updatedAt: new Date(2024, 3, 5),
    author: 'user-1',
    published: true,
    viewCount: 245,
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-2',
    title: 'New Ticket Assigned',
    message: 'You have been assigned ticket #4 - App crashes on startup',
    read: false,
    createdAt: new Date(2024, 4, 16, 9, 0),
    linkTo: '/tickets/ticket-4',
  },
  {
    id: 'notif-2',
    userId: 'user-2',
    title: 'Comment on Ticket',
    message: 'Emma Customer commented on ticket #1 - Cannot access my account',
    read: true,
    createdAt: new Date(2024, 4, 15, 10, 0),
    linkTo: '/tickets/ticket-1',
  },
  {
    id: 'notif-3',
    userId: 'user-3',
    title: 'Ticket Status Changed',
    message: 'Ticket #2 status changed to Pending',
    read: false,
    createdAt: new Date(2024, 4, 15, 11, 0),
    linkTo: '/tickets/ticket-2',
  },
];

// Get current user for demo purposes (always returns the first agent)
export const getCurrentUser = (): User => users.find(user => user.role === 'agent') as User;