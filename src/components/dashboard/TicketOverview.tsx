import React from 'react';
import { Card, CardBody } from '../ui/Card';
import { Inbox, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';

export const TicketOverview: React.FC = () => {
  const { tickets } = useTickets();
  
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(ticket => ticket.status === 'OPEN').length;
  const pendingTickets = tickets.filter(ticket => ticket.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter(ticket => 
    ticket.status === 'RESOLVED' || ticket.status === 'CLOSED').length;
  
  const cards = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      icon: <Inbox className="h-8 w-8 text-indigo-500" />,
      color: 'border-indigo-200 bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Open',
      value: openTickets,
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      color: 'border-amber-200 bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Pending',
      value: pendingTickets,
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      color: 'border-blue-200 bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Resolved',
      value: resolvedTickets,
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-600',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className={`border ${card.color}`}>
          <CardBody className="flex items-center p-6">
            <div className="mr-4">{card.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className={`text-2xl font-semibold ${card.textColor}`}>{card.value}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};