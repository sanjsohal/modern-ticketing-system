import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, Comment, Attachment } from '../types';
import { 
  fetchTickets, 
  createTicketAPI, 
  updateTicketAPI, 
  addCommentAPI, 
  addAttachmentAPI 
} from '../services/ticketService';

interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  getTicketById: (id: string) => Ticket | undefined;
  updateTicket: (updatedTicket: Ticket) => Promise<void>;
  createTicket: (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>) => Promise<Ticket>;
  addComment: (ticketId: string, comment: Omit<Comment, 'id' | 'ticketId' | 'createdAt'>) => Promise<void>;
  addAttachment: (ticketId: string, attachment: Omit<Attachment, 'id' | 'ticketId' | 'uploadedAt'>) => Promise<void>;
}

const TicketContext = createContext<TicketContextType>({
  tickets: [],
  loading: false,
  error: null,
  getTicketById: () => undefined,
  updateTicket: async () => {},
  createTicket: async () => ({} as Ticket),
  addComment: async () => {},
  addAttachment: async () => {},
});

export const useTickets = () => useContext(TicketContext);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tickets from backend API
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch tickets from the backend
        const data = await fetchTickets();
        setTickets(data);
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const updateTicket = async (updatedTicket: Ticket) => {
    try {
      // Update ticket on backend
      const updated = await updateTicketAPI(updatedTicket);
      
      // Update local state
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === updated.id ? updated : ticket
        )
      );
    } catch (err) {
      console.error('Error updating ticket:', err);
      throw err;
    }
  };

  const createTicket = async (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>) => {
    try {
      // Create ticket on backend
      const ticket = await createTicketAPI(newTicket);
      
      // Update local state
      setTickets(prevTickets => [...prevTickets, ticket]);
      return ticket;
    } catch (err) {
      console.error('Error creating ticket:', err);
      throw err;
    }
  };

  const addComment = async (ticketId: string, comment: Omit<Comment, 'id' | 'ticketId' | 'createdAt'>) => {
    try {
      // Add comment on backend
      const newComment = await addCommentAPI(ticketId, comment);
      
      // Update local state
      setTickets(prevTickets => 
        prevTickets.map(ticket => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              comments: [...ticket.comments, newComment],
              updatedAt: new Date(),
            };
          }
          return ticket;
        })
      );
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  const addAttachment = async (ticketId: string, attachment: Omit<Attachment, 'id' | 'ticketId' | 'uploadedAt'>) => {
    try {
      // Add attachment on backend
      const newAttachment = await addAttachmentAPI(ticketId, attachment);
      
      // Update local state
      setTickets(prevTickets => 
        prevTickets.map(ticket => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              attachments: [...ticket.attachments, newAttachment],
              updatedAt: new Date(),
            };
          }
          return ticket;
        })
      );
    } catch (err) {
      console.error('Error adding attachment:', err);
      throw err;
    }
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