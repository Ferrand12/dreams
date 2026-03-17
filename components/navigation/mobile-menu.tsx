'use client';

import { m, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Logo from '@/components/logo';
import { smoothScrollTo } from '@/lib/smooth-scroll';

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export default function MobileMenu({ isOpen, onClose, menuItems }: MobileMenuProps) {
  const router = useRouter();

  const handleMenuClick = (href: string) => {
    onClose();
    if (href.startsWith('#')) {
      // Wait for menu close animation, then smooth scroll via Lenis
      setTimeout(() => smoothScrollTo(href), 450);
    } else {
      setTimeout(() => router.push(href), 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[60] bg-black md:hidden"
        >
          {/* Close Button */}
          <m.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="absolute top-4 right-4 px-4 py-3 flex items-center justify-center border border-overlay-border-medium hover:border-white hover:bg-white group transition-fast"
            aria-label="Close menu"
          >
            <div className="relative w-6 h-6">
              <span className="absolute top-1/2 left-0 w-full h-0.5 bg-white group-hover:bg-black rotate-45 transform -translate-y-1/2" />
              <span className="absolute top-1/2 left-0 w-full h-0.5 bg-white group-hover:bg-black -rotate-45 transform -translate-y-1/2" />
            </div>
          </m.button>

          <div className="h-full flex flex-col items-center justify-center px-8">
            {/* Logo */}
            <m.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-12"
            >
              <Logo
                className="h-auto w-auto max-w-[200px]"
                fill="white"
              />
            </m.div>

            {/* Menu Items */}
            <nav className="flex flex-col items-center gap-8 mb-12">
              {menuItems.map((item, index) => {
                const isCallButton = item.href === '/start';

                return (
                  <m.button
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    onClick={() => handleMenuClick(item.href)}
                    className={
                      isCallButton
                        ? "px-8 py-4 text-2xl font-medium text-black bg-white hover:bg-brand hover:text-white border-2 border-white transition-colors"
                        : "text-4xl font-nostalgic text-white hover:text-brand transition-colors"
                    }
                  >
                    {item.label}
                  </m.button>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute bottom-12 left-0 right-0 px-8"
            >
              <div className="flex items-center justify-between text-sm font-mono">
                <span className="text-muted font-nostalgic">DREEEAMS</span>
                <span className="text-muted">{new Date().getFullYear()}</span>
              </div>
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
