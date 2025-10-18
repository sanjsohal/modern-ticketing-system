import { Ticket, Comment, Attachment } from '../types';
import { auth } from '../config/firebase';
import { getAuth, getIdToken } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to get authorization headers
const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = auth.currentUser ? await getIdToken(auth.currentUser, false) : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Fetch all tickets from the backend
export const fetchTickets = async (): Promise<Ticket[]> => {
  try {
    console.log(getAuthHeaders());
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Fetch a single ticket by ID
export const fetchTicketById = async (id: string): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ticket: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw error;
  }
};

// Create a new ticket
export const createTicketAPI = async (
  ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>
): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(ticket),
    });

    if (!response.ok) {
      throw new Error(`Failed to create ticket: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Update an existing ticket
export const updateTicketAPI = async (ticket: Ticket): Promise<Ticket> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticket.id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(ticket),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ticket: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};

// Delete a ticket
export const deleteTicketAPI = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete ticket: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
};

// Add a comment to a ticket
export const addCommentAPI = async (
  ticketId: string,
  comment: Omit<Comment, 'id' | 'ticketId' | 'createdAt'>
): Promise<Comment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error(`Failed to add comment: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Add an attachment to a ticket
export const addAttachmentAPI = async (
  ticketId: string,
  attachment: Omit<Attachment, 'id' | 'ticketId' | 'uploadedAt'>
): Promise<Attachment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/attachments`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(attachment),
    });

    if (!response.ok) {
      throw new Error(`Failed to add attachment: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding attachment:', error);
    throw error;
  }
};
