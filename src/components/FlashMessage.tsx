import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface FlashMessageProps {
  message?: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
  duration?: number;
}

const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  useEffect(() => {
    // Handle prop message
    if (message) {
      setCurrentMessage(message);
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }

    // Handle initial flash from window (for page loads)
    const flash = (window as any).__FLASH__;
    if (flash && !message) {
      if (typeof flash === 'string') {
        setCurrentMessage(flash);
      } else if (flash.success) {
        setCurrentMessage(flash.success);
      } else if (flash.error) {
        setCurrentMessage(flash.error);
      }
      
      if (currentMessage) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [message, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentMessage(null);
      if (onClose) onClose();
    }, 300);
  };

  if (!currentMessage) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          closeButton: 'text-green-600 hover:text-green-800'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          closeButton: 'text-red-600 hover:text-red-800'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
          closeButton: 'text-blue-600 hover:text-blue-800'
        };
      default:
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          closeButton: 'text-green-600 hover:text-green-800'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`
      fixed top-20 right-4 z-50 max-w-md w-full mx-auto
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
    `}>
      <div className={`
        ${styles.container}
        border rounded-lg shadow-lg p-4
        flex items-center justify-between
        backdrop-blur-sm
      `}>
        <div className="flex items-center space-x-3">
          {styles.icon}
          <span className="font-medium">{currentMessage}</span>
        </div>
        <button
          onClick={handleClose}
          className={`
            ${styles.closeButton}
            hover:bg-white/20 rounded-full p-1
            transition-colors duration-200
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FlashMessage;