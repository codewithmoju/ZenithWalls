import { Platform } from 'react-native';

// Web-specific styles for responsive design
export const webStyles = Platform.OS === 'web' ? `
  /* Responsive container styles */
  .responsive-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 16px;
  }

  @media (min-width: 768px) {
    .responsive-container {
      padding: 0 24px;
    }
  }

  @media (min-width: 1024px) {
    .responsive-container {
      max-width: 1200px;
      padding: 0 32px;
    }
  }

  @media (min-width: 1440px) {
    .responsive-container {
      max-width: 1400px;
      padding: 0 40px;
    }
  }

  @media (min-width: 1920px) {
    .responsive-container {
      max-width: 1600px;
      padding: 0 48px;
    }
  }

  /* Smooth scrolling for web */
  html {
    scroll-behavior: smooth;
  }

  /* Hide scrollbar while keeping functionality */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* Image hover effects */
  .image-hover {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .image-hover:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  /* Button hover effects */
  .button-hover {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  .button-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  .button-hover:active {
    transform: translateY(0);
  }

  /* Text selection styling */
  ::selection {
    background: rgba(139, 92, 246, 0.3);
    color: inherit;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
  }

  /* Input focus styles */
  input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5);
  }

  /* Grid responsive behavior */
  .responsive-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    .responsive-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  }

  @media (min-width: 1024px) {
    .responsive-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
  }

  @media (min-width: 1440px) {
    .responsive-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 28px;
    }
  }

  @media (min-width: 1920px) {
    .responsive-grid {
      grid-template-columns: repeat(6, 1fr);
      gap: 32px;
    }
  }

  /* Loading animations */
  @keyframes shimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  .shimmer {
    animation: shimmer 1.2s ease-in-out infinite;
    background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
    background-size: 800px 104px;
  }

  /* Modal animations */
  .modal-enter {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  .modal-enter-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .modal-exit {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  .modal-exit-active {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
    transition: all 0.2s ease-out;
  }

  /* Backdrop blur effect */
  .backdrop-blur {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Responsive typography */
  .responsive-text-sm {
    font-size: 14px;
  }

  .responsive-text-base {
    font-size: 16px;
  }

  .responsive-text-lg {
    font-size: 18px;
  }

  .responsive-text-xl {
    font-size: 20px;
  }

  .responsive-text-2xl {
    font-size: 24px;
  }

  @media (min-width: 768px) {
    .responsive-text-sm { font-size: 15px; }
    .responsive-text-base { font-size: 17px; }
    .responsive-text-lg { font-size: 20px; }
    .responsive-text-xl { font-size: 22px; }
    .responsive-text-2xl { font-size: 28px; }
  }

  @media (min-width: 1024px) {
    .responsive-text-sm { font-size: 16px; }
    .responsive-text-base { font-size: 18px; }
    .responsive-text-lg { font-size: 22px; }
    .responsive-text-xl { font-size: 24px; }
    .responsive-text-2xl { font-size: 32px; }
  }

  @media (min-width: 1440px) {
    .responsive-text-sm { font-size: 17px; }
    .responsive-text-base { font-size: 19px; }
    .responsive-text-lg { font-size: 24px; }
    .responsive-text-xl { font-size: 26px; }
    .responsive-text-2xl { font-size: 36px; }
  }

  @media (min-width: 1920px) {
    .responsive-text-sm { font-size: 18px; }
    .responsive-text-base { font-size: 20px; }
    .responsive-text-lg { font-size: 26px; }
    .responsive-text-xl { font-size: 28px; }
    .responsive-text-2xl { font-size: 40px; }
  }

  /* Print styles */
  @media print {
    .no-print {
      display: none !important;
    }
    
    body {
      background: white !important;
      color: black !important;
    }
  }

` : '';

// Helper function to inject web styles
export const injectWebStyles = () => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = webStyles;
    document.head.appendChild(styleSheet);
  }
};

export default {
  webStyles,
  injectWebStyles
};
