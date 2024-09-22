import React from 'react';
import { Twitter, Linkedin, Youtube, Instagram, LucideIcon, Github } from 'lucide-react';

interface SocialLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-full px-4 py-2 mb-2 text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
  >
    <Icon className="w-5 h-5 mr-2" />
    <span>{label}</span>
  </a>
);

interface SocialLinkData {
  href: string;
  icon: LucideIcon;
  label: string;
}

const socialLinks: SocialLinkData[] = [
  { href: "https://linkedin.com/in/sagar-sharma-b5ba31210", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com/sagar0028", icon: Github, label: "Github" },
  { href: "https://instagram.com/sagarsharma020", icon: Instagram, label: "Instagram" },
  { href: "https://www.youtube.com/@BeLikeOcean", icon: Youtube, label: "YouTube" },
];

const Portfolio: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/path/to/your/image.jpg')", // Replace with your image path or remove for gradient
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-70"></div>
      {/* Optional Image Background with Overlay */}
      {/* <div className="absolute inset-0 bg-black opacity-30"></div> */}

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sagar Sharma</h1>
          <p className="text-gray-600">Software Engineer || Backend Developer</p>
        </div>
        
        <div className="space-y-4">
          {socialLinks.map((link, index) => (
            <SocialLink key={index} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
