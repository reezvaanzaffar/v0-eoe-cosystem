import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useQuizStore from './store/quizStore';
import useVisitorStore from './store/visitorStore';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PersonaSection from './components/PersonaSection';
import SocialProofSection from './components/SocialProofSection';
import Footer from './components/Footer';
// import PersonaQuiz from './components/quiz/PersonaQuiz'; // Still commented out for now
import ExitIntentPopup from './components/ExitIntentPopup';
// import LeadInfoDisplay from './components/developer/LeadInfoDisplay'; // Commented out as requested
import { HERO_HEADLINE_VARIANTS, SMART_CTA_VARIANTS, PERSONA_SPECIFIC_EXIT_CONTENT } from './constants';
import type { PersonaId, EngagementLevel } from './types';
import { trackExitIntentShown } from './utils/trackingUtils';

// Lazy load hub pages and dashboard
const LaunchHubPage = lazy(() => import('./components/hubs/launch/LaunchHubPage'));
const ScaleHubPage = lazy(() => import('./components/hubs/scale/ScaleHubPage'));
const MasterHubPage = lazy(() => import('./components/hubs/master/MasterHubPage'));
const InvestHubPage = lazy(() => import('./components/hubs/invest/InvestHubPage'));
const ConnectHubPage = lazy(() => import('./components/hubs/connect/ConnectHubPage'));
const AnalyticsDashboard = lazy(() => import('./components/dashboard/AnalyticsDashboard'));
const IntegrationsDashboardPage = lazy(() => import('./components/integrations/IntegrationsDashboardPage')); // New

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  // const [isQuizModalOpen, setIsQuizModalOpen] = useState(false); // Commented out for testing
  const [showExitIntent, setShowExitIntent] = useState(false);
  
  const { determinedPersonaId, engagementLevel, logInteraction, isEmailSubscriber } = useVisitorStore();
  // const { quizCompleted, email: quizEmail } = useQuizStore(); // Commented out for testing

  // Determine headline based on persona or default
  const headline = HERO_HEADLINE_VARIANTS[determinedPersonaId || (engagementLevel === 'low' ? 'default' : 'returning')].content as string;
  const cta = SMART_CTA_VARIANTS[engagementLevel].hero.content as { text: string; actionType: string; variant?: string };

  // Determine exit intent content
  const exitIntentPersonaKey: PersonaId | 'default_exit' | 'unknown' = determinedPersonaId || 'default_exit';
  const exitContent = PERSONA_SPECIFIC_EXIT_CONTENT[exitIntentPersonaKey] || PERSONA_SPECIFIC_EXIT_CONTENT.default_exit;
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      let pageTitle = "Ecommerce Outset"; // Default title

      if (hash.endsWith('-hub')) {
        const hubName = hash.split('-')[0];
        setCurrentView(hubName);
        pageTitle = `${hubName.charAt(0).toUpperCase() + hubName.slice(1)} Hub - Ecommerce Outset`;
      } else if (hash === 'dashboard') {
        setCurrentView('dashboard');
        pageTitle = "Analytics Dashboard - Ecommerce Outset";
      } else if (hash === 'integrations-dashboard') { // New
        setCurrentView('integrations');
        pageTitle = "Integrations Dashboard - Ecommerce Outset";
      } else if (hash === 'quiz-modal') {
        // setIsQuizModalOpen(true); // Commented out for testing
        pageTitle = "Persona Quiz - Ecommerce Outset";
      } else {
        if (currentView !== 'landing' && !hash) { 
           // setCurrentView('landing'); // This might be too aggressive
        }
        // If it's landing or an unknown hash, stick to default or specific landing title
        if (currentView === 'landing' || !hash) {
             pageTitle = "Ecommerce Outset - Amazon Seller Ecosystem";
        }
      }
      document.title = pageTitle;
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // Exit-intent logic
  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      // if (isQuizModalOpen || showExitIntent) return; // Don't show if quiz or another modal is already open
      if (showExitIntent) return; // Prevent re-trigger if already shown
      
      // Basic exit intent: mouse leaves top of viewport or document body
      if (e.clientY <= 0 || (e.relatedTarget == null && e.target !== document.body )) {
        const hasBeenShown = sessionStorage.getItem('exitIntentShown');
        if (!hasBeenShown) {
          setShowExitIntent(true);
          sessionStorage.setItem('exitIntentShown', 'true');
          trackExitIntentShown(exitIntentPersonaKey);
        }
      }
    };
    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, [showExitIntent, exitIntentPersonaKey]);


  // const closeQuizModal = () => { // Commented out for testing
  //   setIsQuizModalOpen(false);
  //   if (window.location.hash === '#quiz-modal') {
  //     window.history.pushState("", document.title, window.location.pathname + window.location.search);
  //   }
  // };

  const handleExitIntentSubmit = (email: string) => {
    logInteraction('exit_intent_conversion', { email_captured: true, persona_context: exitIntentPersonaKey });
    useVisitorStore.getState().setEmailSubscriberStatus(true); // Update store
    setShowExitIntent(false);
    alert(`Thanks for subscribing, ${email}! (Placeholder - from exit intent)`);
  };

  const renderView = () => {
    // For Next.js, these would typically be pages in the `pages` or `app` directory.
    // Image optimization (next/image) and font optimization (next/font) would be handled by Next.js.
    // Routing would use next/link and next/router.
    // For performance, ensure images are appropriately sized and compressed. If using Next.js, `next/image` handles this.
    // For accessibility, ensure all images have meaningful alt text.
    const commonSuspenseFallback = <div className="text-center p-10 text-xl text-gray-300" role="status" aria-live="polite">Loading...</div>;
    switch (currentView) {
      case 'launch': return <Suspense fallback={commonSuspenseFallback}><LaunchHubPage /></Suspense>;
      case 'scale': return <Suspense fallback={commonSuspenseFallback}><ScaleHubPage /></Suspense>;
      case 'master': return <Suspense fallback={commonSuspenseFallback}><MasterHubPage /></Suspense>;
      case 'invest': return <Suspense fallback={commonSuspenseFallback}><InvestHubPage /></Suspense>;
      case 'connect': return <Suspense fallback={commonSuspenseFallback}><ConnectHubPage /></Suspense>;
      case 'dashboard': return <Suspense fallback={commonSuspenseFallback}><AnalyticsDashboard /></Suspense>;
      case 'integrations': return <Suspense fallback={commonSuspenseFallback}><IntegrationsDashboardPage /></Suspense>; // New
      case 'landing':
      default:
        return (
          <>
            <HeroSection headlineVariant={headline} ctaVariant={cta} />
            <PersonaSection />
            <SocialProofSection />
            <Footer showNewsletterSignup={!isEmailSubscriber} />
          </>
        );
    }
  };
  
  const pageTransition = {
    initial: { opacity: 0, x: 0 }, // Removed x slide for simpler transition
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 0 }, 
    transition: { duration: 0.3, ease: "easeInOut" }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      <Header />
      {/* 
        The <main> element contains the primary content of the page.
        role="main" explicitly defines its landmark role.
        aria-live="polite" makes screen readers announce changes when the view updates (e.g., new page content loaded).
        aria-atomic="true" ensures the entire region is announced as a whole when changes occur.
        Adjusted pt-16 (64px) / md:pt-[68px] (approx for h-16 + padding/border from scrolled header) - ensure this matches header height.
      */}
      <main role="main" className="flex-grow pt-16 md:pt-[72px]" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* {isQuizModalOpen && ( // Commented out for testing
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-0 sm:p-4"
            onClick={(e) => { 
              if (e.target === e.currentTarget) closeQuizModal(); // Close only on backdrop click
            }}
            // Quiz Modal Accessibility (role="dialog", aria-modal, aria-labelledby) should be within PersonaQuiz component
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-2xl sm:max-h-[90vh] md:max-w-3xl lg:max-w-4xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
            >
              <PersonaQuiz onClose={closeQuizModal} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )} */}

      <AnimatePresence>
        {showExitIntent && (
          <ExitIntentPopup
            content={exitContent}
            onClose={() => setShowExitIntent(false)}
            onSubmit={handleExitIntentSubmit}
          />
        )}
      </AnimatePresence>
      
      {/* <LeadInfoDisplay /> */} {/* Commented out as requested */}
    </div>
  );
};

export default App;
