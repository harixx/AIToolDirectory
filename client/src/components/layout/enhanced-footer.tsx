import { Link } from 'wouter';
import { 
  Heart, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  ArrowUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResponsiveContainer } from '@/components/design-system/responsive-container';

export default function EnhancedFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 neural-grid opacity-5" />
      
      <ResponsiveContainer className="relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-neural">AI Tool Directory</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Discover, compare, and choose from the best AI tools across different categories. 
                Your gateway to the future of artificial intelligence.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <Github className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Explore Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Explore</h3>
              <nav className="space-y-2">
                <Link href="/tools">
                  <a className="block text-gray-400 hover:text-white transition-colors duration-300">
                    Browse Tools
                  </a>
                </Link>
                <Link href="/categories">
                  <a className="block text-gray-400 hover:text-white transition-colors duration-300">
                    Categories
                  </a>
                </Link>
                <Link href="/compare">
                  <a className="block text-gray-400 hover:text-white transition-colors duration-300">
                    Compare Tools
                  </a>
                </Link>
                <Link href="/pricing">
                  <a className="block text-gray-400 hover:text-white transition-colors duration-300">
                    Pricing
                  </a>
                </Link>
              </nav>
            </div>

            {/* For Developers Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">For Developers</h3>
              <nav className="space-y-2">
                <Link href="/submit-tool">
                  <a className="block text-gray-400 hover:text-white transition-colors duration-300">
                    Submit Tool
                  </a>
                </Link>
                <Link href="/dashboard">
                  <a className="block text-gray-400 hover:text-white transition-colors duration-300">
                    Dashboard
                  </a>
                </Link>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300">
                  API Documentation
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-300">
                  Developer Blog
                </a>
              </nav>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Get weekly updates on the latest AI tools and trends.
              </p>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary"
                />
                <Button className="w-full btn-primary">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <p>© 2025 AI Tool Directory. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  Cookie Policy
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-400 flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for AI enthusiasts
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={scrollToTop}
                className="text-gray-400 hover:text-white p-2"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}