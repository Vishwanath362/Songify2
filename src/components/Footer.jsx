import React from 'react';
import { Music, Heart, Github, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Features', href: '#' },
            { name: 'Pricing', href: '#' },
            { name: 'API', href: '#' },
            { name: 'Mobile App', href: '#' }
        ],
        resources: [
            { name: 'Help Center', href: '#' },
            { name: 'Tutorials', href: '#' },
            { name: 'Community', href: '#' },
            { name: 'Blog', href: '#' }
        ],
        company: [
            { name: 'About Us', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Press', href: '#' },
            { name: 'Contact', href: '#' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'DMCA', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: Twitter, href: '#', name: 'Twitter' },
        { icon: Instagram, href: '#', name: 'Instagram' },
        { icon: Github, href: 'https://github.com/Vishwanath362', name: 'Github' },
        { icon: Mail, href: '#', name: 'Email' }
    ];

    return (
        <footer className="bg-gradient-to-t from-gray-950 via-gray-900 to-gray-800 border-t border-gray-800">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                                <Music className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent">
                                SONGIFY
                            </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            Your personal music stage. Create, share, and discover amazing music with creators around the world. Join our community of passionate musicians and music lovers.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="p-2 bg-gray-800 hover:bg-green-600 rounded-lg transition-all duration-300 group"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Product</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="text-gray-400 text-sm hover:text-green-400 transition-colors duration-300">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Resources</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="text-gray-400 text-sm hover:text-green-400 transition-colors duration-300">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="text-gray-400 text-sm hover:text-green-400 transition-colors duration-300">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="text-gray-400 text-sm hover:text-green-400 transition-colors duration-300">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-white font-semibold mb-2">Stay in the loop</h3>
                            <p className="text-gray-400 text-sm mb-4">Get the latest updates, new features, and music trends delivered to your inbox.</p>
                            
                            <div className="flex gap-3 max-w-md">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-400" />
                                <span>Ambala, Haryana</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-green-400" />
                                <span>vishwanath@songify.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 bg-gray-950/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <p>&copy; {currentYear} Songify. All rights reserved.</p>
                            <span className="hidden md:block">•</span>
                            <p className="flex items-center gap-1">
                                Made with <Heart className="w-4 h-4 text-red-500" /> for music lovers
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Available on</span>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-gray-800 rounded-full text-xs">iOS</div>
                                <div className="px-3 py-1 bg-gray-800 rounded-full text-xs">Android</div>
                                <div className="px-3 py-1 bg-gray-800 rounded-full text-xs">Web</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

         
        </footer>
    );
};

export default Footer;
