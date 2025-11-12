'use client';

import Footer from './Footer';
import { useFooter } from '../contexts/FooterContext';

const ConditionalFooter = () => {
  const { footerType } = useFooter();
  
  // For now, always show standard footer
  // Can add FunnelFooter component later if needed
  return <Footer />;
};

export default ConditionalFooter;

