import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, Comment, Attachment } from '../types';
import { tickets as mockTickets } from '../data/mockData';

interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  getTicketById: (id: string) => Ticket | undefined;
  updateTicket: (updatedTicket: Ticket) => void;
  createTicket: (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>) => Ticket;
  addComment: (ticketId: string, comment: Omit<Comment, 'id' | 'ticketId' | 'createdAt'>) => void;
  addAttachment: (ticketId: string, attachment: Omit<Attachment, 'id' | 'ticketId' | 'uploadedAt'>) => void;
}

const TicketContext = createContext<TicketContextType>({
  tickets: [],
  loading: false,
  error: null,
  getTicketById: () => undefined,
  updateTicket: () => {},
  createTicket: () => ({} as Ticket),
  addComment: () => {},
  addAttachment: () => {},
});

export const useTickets = () => useContext(TicketContext);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulating API fetch
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call
        setTickets(mockTickets);
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === updatedTicket.id 
          ? { ...updatedTicket, updatedAt: new Date() } 
          : ticket
      )
    );
  };

  const createTicket = (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>) => {
    const now = new Date();
    const ticket: Ticket = {
      ...newTicket,
      id: `ticket-${tickets.length + 1}`,
      createdAt: now,
      updatedAt: now,
      comments: [],
      attachments: [],
    };

    setTickets(prevTickets => [...prevTickets, ticket]);
    return ticket;
  };

  const addComment = (ticketId: string, comment: Omit<Comment, 'id' | 'ticketId' | 'createdAt'>) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const newComment: Comment = {
            id: `comment-${ticket.comments.length + 1}`,
            ticketId,
            createdAt: new Date(),
            ...comment,
          };
          return {
            ...ticket,
            comments: [...ticket.comments, newComment],
            updatedAt: new Date(),
          };
        }
        return ticket;
      })
    );
  };

  const addAttachment = (ticketId: string, attachment: Omit<Attachment, 'id' | 'ticketId' | 'uploadedAt'>) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const newAttachment: Attachment = {
            id: `attachment-${ticket.attachments.length + 1}`,
            ticketId,
            uploadedAt: new Date(),
            ...attachment,
          };
          return {
            ...ticket,
            attachments: [...ticket.attachments, newAttachment],
            updatedAt: new Date(),
          };
        }
        return ticket;
      })
    );
  };

  return (
    <TicketContext.Provider value={{ 
      tickets, 
      loading, 
      error, 
      getTicketById, 
      updateTicket, 
      createTicket, 
      addComment, 
      addAttachment 
    }}>
      {children}
    </TicketContext.Provider>
  );
};