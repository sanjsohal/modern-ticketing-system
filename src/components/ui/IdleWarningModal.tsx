import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface IdleWarningModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onLogout: () => void;
  countdown: number; // seconds until auto-logout
}

export const IdleWarningModal: React.FC<IdleWarningModalProps> = ({
  isOpen,
  onContinue,
  onLogout,
  countdown: initialCountdown,
}) => {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(initialCountdown);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, initialCountdown, onLogout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Are you still there?
            </h3>
            <p className="text-gray-600 mb-4">
              You've been inactive for a while. For your security, you'll be logged out automatically in{' '}
              <span className="font-bold text-red-600">{countdown}</span> seconds.
            </p>
            <div className="flex space-x-3">
              <Button onClick={onContinue} className="flex-1">
                Stay Logged In
              </Button>
              <Button
                onClick={onLogout}
                variant="secondary"
                className="flex-1"
              >
                Logout Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
