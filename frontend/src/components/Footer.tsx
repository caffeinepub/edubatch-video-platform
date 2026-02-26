import { GraduationCap, Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Category } from '../backend';
import { CATEGORY_LABELS } from '../lib/utils';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'edubatch-platform');

  return (
    <footer className="bg-footer border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-6 w-6 text-amber" />
              <span className="font-heading font-bold text-lg text-foreground">EduStream Academy</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quality education for Classes 6–12 and NEET aspirants. Learn at your own pace with expert-curated video content.
            </p>
          </div>

          {/* Classes */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Classes</h4>
            <div className="grid grid-cols-2 gap-1">
              {Object.values(Category).map((cat) => (
                <Link
                  key={cat}
                  to="/category/$category"
                  params={{ category: cat }}
                  className="text-sm text-foreground/70 hover:text-primary transition-colors py-0.5"
                >
                  {CATEGORY_LABELS[cat]}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Platform</h4>
            <div className="flex flex-col gap-1">
              <Link to="/" className="text-sm text-foreground/70 hover:text-primary transition-colors py-0.5">Home</Link>
              <Link to="/admin" className="text-sm text-foreground/70 hover:text-primary transition-colors py-0.5">Admin Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {year} EduStream Academy. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-amber fill-amber mx-0.5" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
