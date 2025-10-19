import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Filter, Plus } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { TicketStatus, TicketPriority } from '../../types';
import { users } from '../../data/mockData';

export const TicketList: React.FC = () => {
  const { tickets, loading, error } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const getStatusBadge = (status: TicketStatus) => {
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
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="default">Low</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'high':
        return <Badge variant="danger">High</Badge>;
      case 'urgent':
        return <Badge variant="danger">Urgent</Badge>;
    }
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Tickets</h1>
        <Link to="/tickets/new">
          <Button leftIcon={<Plus size={16} />}>New Ticket</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p className="font-medium">Error loading tickets</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <Button variant="outline" leftIcon={<Filter size={16} />}>
                More Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const requester = getUserById(ticket.createdBy);
                  const assignee = ticket.assignedTo ? getUserById(ticket.assignedTo) : null;

                  return (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          {ticket.title}
                        </Link>
                        <div className="text-sm text-gray-500 truncate" style={{ maxWidth: '250px' }}>
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {requester ? (
                          <div className="flex items-center">
                            <Avatar src={requester.avatar} name={requester.name} size="xs" />
                            <span className="ml-2 text-sm text-gray-900">{requester.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unknown</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignee ? (
                          <div className="flex items-center">
                            <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
                            <span className="ml-2 text-sm text-gray-900">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(ticket.updatedAt, 'dd MMM yyyy, hh:mm a')}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
};