import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import { 
  ChevronLeft, 
  MessageSquare, 
  Paperclip, 
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { fetchTicketById } from '../../services/ticketService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardBody } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { TicketStatus, User } from '../../types';
import { useUsers } from '../../context/UserContext';

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { updateTicket, addComment } = useTickets();
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { users } = useUsers();

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTicketById(id as string);
        setTicket(data);
      } catch (err: any) {
        setError('Ticket not found or failed to fetch.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Loading Ticket...</h2>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Ticket Not Found</h2>
        <p className="text-gray-500 mb-4">{error || "The ticket you're looking for doesn't exist or may have been removed."}</p>
        <Link to="/tickets">
          <Button variant="primary">Back to Tickets</Button>
        </Link>
      </div>
    );
  }
  
  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket({ ...ticket, status: newStatus });
  };
  
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assigneeId = e.target.value === 'unassigned' ? null : e.target.value;
    updateTicket({ ...ticket, assignedTo: assigneeId });
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    addComment(ticket.id, {
      content: newComment,
      createdBy: users[1].id, // Using the first agent for demo
      isInternal,
    });
    
    setNewComment('');
    setIsInternal(false);
  };
  
  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };
  
  const requester = getUserById(ticket.createdBy);
  const assignee = ticket.assignedTo ? getUserById(ticket.assignedTo) : null;

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="warning">Open</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'RESOLVED':
        return <Badge variant="success">Resolved</Badge>;
      case 'CLOSED':
        return <Badge variant="default">Closed</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="default">Low</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'high':
        return <Badge variant="danger">High</Badge>;
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/tickets" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all tickets
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-xl font-semibold text-gray-900">{ticket.title}</h1>
            <div className="mt-2 sm:mt-0 space-x-2">
              {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                <Button 
                  variant="success" 
                  size="sm"
                  leftIcon={<CheckCircle size={16} />}
                  onClick={() => handleStatusChange('RESOLVED')}
                >
                  Resolve
                </Button>
              )}
              {ticket.status === 'RESOLVED' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusChange('CLOSED')}
                >
                  Close
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Status:</span>
              {getStatusBadge(ticket.status)}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Priority:</span>
              {getPriorityBadge(ticket.priority)}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Category:</span>
              <Badge variant="secondary">
                {ticket.category.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
              </Badge>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Created:</span>
              <span className="text-sm">{formatDate(ticket.createdAt, 'MMM d, yyyy h:mm a')}</span>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Requester</h3>
              {requester ? (
                <div className="flex items-center">
                  <Avatar src={requester.avatar} name={requester.name} size="sm" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">{requester.name}</p>
                    <p className="text-xs text-gray-500">{requester.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Unknown</p>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned to</h3>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={ticket.assignedTo || 'unassigned'}
                onChange={handleAssigneeChange}
              >
                <option value="unassigned">Unassigned</option>
                {users
                  .filter(user => user.role === 'USER')
                  .map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <div className="text-sm text-gray-800 mb-6 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200">
            {ticket.description}
          </div>

          {ticket.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
              <div className="space-y-2">
                {ticket.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center p-2 border border-gray-200 rounded-md">
                    <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      {attachment.filename}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({Math.round(attachment.size / 1024)} KB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">
                Comments ({ticket.comments.length})
              </h3>
            </div>
            
            {ticket.comments.length > 0 ? (
              <div className="space-y-4">
                {ticket.comments.map(comment => {
                  const commenter = getUserById(comment.createdBy);
                  
                  return (
                    <Card key={comment.id} className={`${comment.isInternal ? 'border-l-4 border-l-amber-400' : ''}`}>
                      <CardBody>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <Avatar
                              src={commenter?.avatar}
                              name={commenter?.name || 'Unknown'}
                              size="sm"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {commenter?.name || 'Unknown'}
                                  {comment.isInternal && (
                                    <span className="ml-2 text-xs text-amber-600 font-normal">
                                      Internal Note
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(comment.createdAt, 'MMM d, yyyy h:mm a')}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 mb-1">No comments yet</p>
                <p className="text-xs text-gray-400">Be the first to reply</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Add Comment</h3>
            <form onSubmit={handleSubmitComment}>
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Type your reply here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="internal"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                  />
                  <label htmlFor="internal" className="ml-2 text-sm text-gray-700">
                    Internal note (only visible to agents)
                  </label>
                </div>
                <Button type="submit" leftIcon={<Send size={16} />} disabled={!newComment.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};