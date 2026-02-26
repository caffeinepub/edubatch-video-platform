import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X, GraduationCap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '../backend';
import { CATEGORY_LABELS } from '../lib/utils';
import { useIsCallerAdmin } from '../hooks/useQueries';

const CLASS_CATEGORIES = [
  Category.class6,
  Category.class7,
  Category.class8,
  Category.class9,
  Category.class10,
  Category.class11,
  Category.class12,
];

export default function NavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <header className="sticky top-0 z-50 bg-nav border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/edustream-logo.dim_256x64.png"
            alt="EduStream Academy"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <span
            className="hidden items-center gap-1.5 font-heading font-bold text-xl text-primary"
            style={{ display: 'none' }}
          >
            <GraduationCap className="h-6 w-6 text-amber" />
            <span>EduStream</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {CLASS_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/category/$category"
              params={{ category: cat }}
              className="px-3 py-1.5 text-sm font-medium rounded-md text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              activeProps={{ className: 'text-primary bg-primary/10' }}
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
          <Link
            to="/category/$category"
            params={{ category: Category.neet }}
            className="px-3 py-1.5 text-sm font-bold rounded-md text-neet hover:bg-neet/10 transition-colors"
            activeProps={{ className: 'bg-neet/10' }}
          >
            NEET
          </Link>
          {isAdmin && (
            <>
              <div className="w-px h-5 bg-border mx-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/admin' })}
                className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Settings className="h-3.5 w-3.5" />
                Admin
              </Button>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-nav border-t border-border px-4 py-3 flex flex-col gap-1">
          {CLASS_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to="/category/$category"
              params={{ category: cat }}
              className="px-3 py-2 text-sm font-medium rounded-md text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {CATEGORY_LABELS[cat]}
            </Link>
          ))}
          <Link
            to="/category/$category"
            params={{ category: Category.neet }}
            className="px-3 py-2 text-sm font-bold rounded-md text-neet hover:bg-neet/10 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            NEET
          </Link>
          {isAdmin && (
            <>
              <div className="h-px bg-border my-1" />
              <Link
                to="/admin"
                className="px-3 py-2 text-sm font-medium rounded-md text-primary hover:bg-primary/10 flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
