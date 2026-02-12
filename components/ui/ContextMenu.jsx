'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ContextMenu = ({
  children,
  items = [],
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const containerRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    
    const x = e.clientX;
    const y = e.clientY;
    
    // Adjust position if menu would go off screen
    const menuWidth = 200;
    const menuHeight = items.length * 40;
    
    const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
    const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;
    
    setPosition({ x: adjustedX, y: adjustedY });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleClose();
      }
    };

    const handleScroll = () => {
      handleClose();
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={containerRef}
        onContextMenu={handleContextMenu}
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 100,
            }}
            className="min-w-[200px] bg-bg-secondary rounded-lg shadow-lg border border-border overflow-hidden"
          >
            {items.map((item, index) => (
              item.separator ? (
                <div key={index} className="h-px bg-border my-1" />
              ) : (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm',
                    'flex items-center gap-3',
                    'hover:bg-bg-hover transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    item.danger && 'text-error hover:bg-error/10',
                    !item.danger && 'text-text-primary'
                  )}
                >
                  {item.icon && (
                    <span className="w-4 h-4 text-text-muted">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContextMenu;