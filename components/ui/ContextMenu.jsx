'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ContextMenu = ({
  children,
  items = [],
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCoords({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleItemClick = (item) => {
    if (item.onClick) item.onClick();
    if (onItemClick) onItemClick(item);
    handleClose();
  };

  // 🔽 این بخش اصلاح شد 🔽
  useLayoutEffect(() => {
    if (isOpen && menuRef.current) {
      const menu = menuRef.current;
      const { innerWidth, innerHeight } = window;
      const { offsetWidth: menuWidth, offsetHeight: menuHeight } = menu;

      let x = coords.x;
      let y = coords.y;

      // 1. تنظیم افقی (X)
      // اگر از سمت راست صفحه بیرون می‌زند، به سمت چپ باز شود
      if (x + menuWidth > innerWidth) {
        x -= menuWidth;
      }
      // اگر بعد از تغییر جهت، از سمت چپ بیرون زد، آن را به لبه چپ بچسبان (حداقل 5 پیکسل فاصله)
      if (x < 5) {
        x = 5;
      }

      // 2. تنظیم عمودی (Y)
      // اگر از پایین صفحه بیرون می‌زند، به سمت بالا باز شود
      if (y + menuHeight > innerHeight) {
        y -= menuHeight;
      }
      // اصلاح نهایی: اگر بعد از بالا رفتن، از سقف صفحه بیرون زد، آن را به لبه بالا بچسبان (حداقل 5 پیکسل فاصله)
      if (y < 5) {
        y = 5; 
      }

      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
    }
  }, [isOpen, coords]);
  // 🔼 پایان اصلاح 🔼

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleClose();
      }
    };
    const handleScroll = () => { if (isOpen) handleClose(); };
    const handleResize = () => { if (isOpen) handleClose(); };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  if (!mounted) return <div onContextMenu={handleContextMenu}>{children}</div>;

  return (
    <>
      <div onContextMenu={handleContextMenu} className="contents">
        {children}
      </div>

      {isOpen && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.08 }}
              className="fixed z-[9999] min-w-[160px] max-w-[220px] bg-bg-secondary rounded-lg shadow-xl border border-border overflow-hidden py-1"
              style={{
                left: 0, // مقادیر اولیه صفر هستند تا useLayoutEffect آن‌ها را ست کند
                top: 0,
              }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {items.map((item, index) => (
                item.separator ? (
                  <div key={index} className="h-px bg-border my-1 mx-2" />
                ) : (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    disabled={item.disabled}
                    className={cn(
                      'w-full px-3 py-1.5 text-left text-xs font-medium',
                      'flex items-center gap-2',
                      'hover:bg-accent/10 hover:text-accent transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      item.danger && 'text-error hover:bg-error/10 hover:text-error',
                      !item.danger && 'text-text-primary'
                    )}
                  >
                    {item.icon && (
                      <span className="opacity-70 w-3.5 h-3.5 flex items-center justify-center shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ContextMenu;