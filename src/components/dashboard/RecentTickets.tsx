import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useTickets } from '../../context/TicketContext';

export const RecentTickets: React.FC = () => {
  const { tickets } = useTickets();
  
  const sortedTickets = [...tickets]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="primary">New</Badge>;
      case 'open':
        return <Badge variant="warning">Open</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="default">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(ticket.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getPriorityBadge(ticket.priority)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(ticket.updatedAt, 'MMM d, h:mm a')}
                  </td>
                </tr>
              ))}
              {sortedTickets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link
            to="/tickets"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            View all tickets →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};