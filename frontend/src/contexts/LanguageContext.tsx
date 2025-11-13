'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

const translations: Translations = {
  // Header
  'header.title': {
    en: 'Dashboard',
    fr: 'Tableau de bord'
  },
  'header.jointResearchCentre': {
    en: 'Joint Research Centre',
    fr: 'Centre commun de recherche'
  },
  'header.earthObservation': {
    en: 'EARTH OBSERVATION PROCESSING SERVICE',
    fr: 'SERVICE DE TRAITEMENT D\'OBSERVATION DE LA TERRE'
  },
  'header.version': {
    en: 'Version 1.3.2',
    fr: 'Version 1.3.2'
  },
  'header.login': {
    en: 'Login',
    fr: 'Connexion'
  },
  'header.register': {
    en: 'Register',
    fr: 'S\'inscrire'
  },
  'header.or': {
    en: 'or',
    fr: 'ou'
  },
  'header.english': {
    en: 'English',
    fr: 'Anglais'
  },
  'header.french': {
    en: 'French',
    fr: 'Français'
  },

  // Menu items
  'menu.dashboard': {
    en: 'Dashboard',
    fr: 'Tableau de bord'
  },
  'menu.analytics': {
    en: 'Analytics',
    fr: 'Analyses'
  },
  'menu.users': {
    en: 'Users',
    fr: 'Utilisateurs'
  },
  'menu.settings': {
    en: 'Settings',
    fr: 'Paramètres'
  },
  'menu.help': {
    en: 'Help',
    fr: 'Aide'
  },
  'menu.portfolio': {
    en: 'Portfolio',
    fr: 'Portefeuille'
  },
  'menu.acquisition': {
    en: 'Acquisition',
    fr: 'Acquisition'
  },
  'menu.processing': {
    en: 'Processing',
    fr: 'Traitement'
  },
  'menu.dataManagement': {
    en: 'Data Management',
    fr: 'Gestion des données'
  },
  'menu.analysis': {
    en: 'Analysis',
    fr: 'Analyse'
  },
  'menu.fitnessForPurposes': {
    en: 'Fitness for Purposes',
    fr: 'Aptitude aux fins'
  },
  'menu.impactToolbox': {
    en: 'IMPACT toolbox',
    fr: 'Boîte à outils IMPACT'
  },
  'menu.jupyterNotebook': {
    en: 'Jupyter Notebook',
    fr: 'Jupyter Notebook'
  },
  'menu.systemSettings': {
    en: 'System settings',
    fr: 'Paramètres système'
  },

  // Dashboard sections
  'dashboard.dataInformation': {
    en: 'Data Information',
    fr: 'Informations de données'
  },
  'dashboard.archiveStatus': {
    en: 'Archive Status',
    fr: 'État de l\'archive'
  },
  'dashboard.availableProducts': {
    en: 'Available Products by Category',
    fr: 'Produits disponibles par catégorie'
  },
  'dashboard.newProducts': {
    en: 'New products deployed in upgrade to version 1.3.3',
    fr: 'Nouveaux produits déployés dans la mise à niveau vers la version 1.3.3'
  },
  'dashboard.productCategories': {
    en: 'Product categories',
    fr: 'Catégories de produits'
  },
  'dashboard.products': {
    en: 'PRODUCTS',
    fr: 'PRODUITS'
  },
  'dashboard.description': {
    en: 'Description',
    fr: 'Description'
  },
  'dashboard.datasetCompleteness': {
    en: 'Dataset completeness',
    fr: 'Complétude des données'
  },

  // Archive status
  'archive.present': {
    en: 'Present',
    fr: 'Présent'
  },
  'archive.missing': {
    en: 'Missing',
    fr: 'Manquant'
  },

  // Categories (legacy format)
  'category.vegetation': {
    en: 'Vegetation',
    fr: 'Végétation'
  },
  'category.temperatureForecast': {
    en: 'Temperature (Forecast)',
    fr: 'Température (Prévision)'
  },
  'category.precipitationMonitoring': {
    en: 'Precipitation (Monitoring)',
    fr: 'Précipitations (Suivi)'
  },
  'category.continentalWater': {
    en: 'Continental Water',
    fr: 'Eaux continentales'
  },
  'category.precipitationForecast': {
    en: 'Precipitation (Forecast)',
    fr: 'Précipitations (Prévisions)'
  },
  'category.temperatureMonitoring': {
    en: 'Temperature (Monitoring)',
    fr: 'Température (Suivi)'
  },
  'category.various': {
    en: 'Various',
    fr: 'Divers'
  },
  'category.fire': {
    en: 'Fire',
    fr: 'Feu'
  },
  'category.oceanography': {
    en: 'Oceanography',
    fr: 'Océanographie'
  },
  'category.miscellaneous': {
    en: 'Miscellaneous',
    fr: 'Divers'
  },

  // Product Categories (for charts)
  'categories.vegetation': {
    en: 'Vegetation',
    fr: 'Végétation'
  },
  'categories.precipitationMonitoring': {
    en: 'Precipitation Monitoring',
    fr: 'Suivi des précipitations'
  },
  'categories.precipitationForecast': {
    en: 'Precipitation Forecast',
    fr: 'Prévisions de précipitations'
  },
  'categories.temperatureMonitoring': {
    en: 'Temperature Monitoring',
    fr: 'Suivi de la température'
  },
  'categories.temperatureForecast': {
    en: 'Temperature Forecast',
    fr: 'Prévisions de température'
  },
  'categories.continentalWater': {
    en: 'Continental Water',
    fr: 'Eaux continentales'
  },
  'categories.fire': {
    en: 'Fire',
    fr: 'Feu'
  },
  'categories.oceanography': {
    en: 'Oceanography',
    fr: 'Océanographie'
  },
  'categories.various': {
    en: 'Various',
    fr: 'Divers'
  },
  'categories.miscellaneous': {
    en: 'Miscellaneous',
    fr: 'Divers'
  },
  'categories.land': {
    en: 'Land',
    fr: 'Terre'
  },
  'categories.marine': {
    en: 'Marine',
    fr: 'Marin'
  },
  'categories.other': {
    en: 'Other',
    fr: 'Autre'
  },
  'categories.rainfallmonitoring': {
    en: 'Rainfall (Monitoring)',
    fr: 'Précipitations (Suivi)'
  },
  'categories.rainfallforecast': {
    en: 'Rainfall (Forecast)',
    fr: 'Précipitations (Prévision)'
  },
  'categories.inlandwater': {
    en: 'Inland water',
    fr: 'Eaux continentales'
  },
  'categories.atmosphere': {
    en: 'Atmosphere',
    fr: 'Atmosphère'
  },
  'categories.temperaturemonitoring': {
    en: 'Temperature (Monitoring)',
    fr: 'Température (Suivi)'
  },
  'categories.temperatureforecast': {
    en: 'Temperature (Forecast)',
    fr: 'Température (Prévision)'
  },

  // Services
  'services.title': {
    en: 'Services',
    fr: 'Services'
  },
  'services.eumetcast': {
    en: 'Eumetcast',
    fr: 'Eumetcast'
  },
  'services.internet': {
    en: 'Internet',
    fr: 'Internet'
  },
  'services.dataStore': {
    en: 'Data Store',
    fr: 'Magasin de données'
  },
  'services.ingestion': {
    en: 'Ingestion',
    fr: 'Ingestion'
  },
  'services.processing': {
    en: 'Processing',
    fr: 'Traitement'
  },
  'services.system': {
    en: 'System',
    fr: 'Système'
  },

  // Service actions
  'action.execute': {
    en: 'Execute',
    fr: 'Exécuter'
  },
  'action.stop': {
    en: 'Stop',
    fr: 'Arrêter'
  },
  'action.restart': {
    en: 'Restart',
    fr: 'Redémarrer'
  },
  'action.viewLogs': {
    en: 'View log file',
    fr: 'Voir le fichier journal'
  },

  // Portfolio
  'portfolio.search': {
    en: 'Search Products',
    fr: 'Rechercher des produits'
  },
  'portfolio.searchPlaceholder': {
    en: 'Search products...',
    fr: 'Rechercher des produits...'
  },
  'portfolio.themes': {
    en: 'Themes',
    fr: 'Thèmes'
  },
  'portfolio.selectAll': {
    en: 'Select All',
    fr: 'Tout sélectionner'
  },
  'portfolio.productCategories': {
    en: 'Product Categories',
    fr: 'Catégories de produits'
  },
  'portfolio.regions': {
    en: 'Regions',
    fr: 'Régions'
  },
  'portfolio.currentPortfolio': {
    en: 'Current Portfolio',
    fr: 'Portefeuille actuel'
  },
  'portfolio.createService': {
    en: 'Create Service',
    fr: 'Créer un service'
  },
  'portfolio.importPortfolio': {
    en: 'Import Portfolio',
    fr: 'Importer le portefeuille'
  },
  'portfolio.exportPortfolio': {
    en: 'Export Portfolio',
    fr: 'Exporter le portefeuille'
  },
  'portfolio.validatePortfolio': {
    en: 'Validate Portfolio',
    fr: 'Valider le portefeuille'
  },
  'portfolio.backupPortfolio': {
    en: 'Backup Portfolio',
    fr: 'Sauvegarder le portefeuille'
  },
  'portfolio.portfolioSettings': {
    en: 'Portfolio Settings',
    fr: 'Paramètres du portefeuille'
  },
  'portfolio.quickStats': {
    en: 'Quick Stats',
    fr: 'Statistiques rapides'
  },
  'portfolio.totalServices': {
    en: 'Total Services',
    fr: 'Services totaux'
  },
  'portfolio.totalProducts': {
    en: 'Total Products',
    fr: 'Produits totaux'
  },
  'portfolio.totalProductCategories': {
    en: 'Total Product Categories',
    fr: 'Catégories de produits totales'
  },
  'portfolio.actions': {
    en: 'Actions',
    fr: 'Actions'
  },
  'portfolio.help': {
    en: 'Help',
    fr: 'Aide'
  },
  'portfolio.documentation': {
    en: 'Documentation',
    fr: 'Documentation'
  },
  'portfolio.tutorial': {
    en: 'Tutorial',
    fr: 'Tutoriel'
  },
  'portfolio.searchButton': {
    en: 'Search',
    fr: 'Rechercher'
  },
  'portfolio.newProductsVersion': {
    en: 'Search only new products in version 4.0',
    fr: 'Rechercher uniquement les nouveaux produits de la version 4.0'
  },
  'portfolio.new': {
    en: 'New',
    fr: 'Nouveau'
  },

  // Regions
  'regions.global': {
    en: 'Global',
    fr: 'Mondial'
  },
  'regions.africa': {
    en: 'Africa',
    fr: 'Afrique'
  },
  'regions.europe': {
    en: 'Europe',
    fr: 'Europe'
  },
  'regions.asia': {
    en: 'Asia',
    fr: 'Asie'
  },
  'regions.northamerica': {
    en: 'North America',
    fr: 'Amérique du Nord'
  },
  'regions.southamerica': {
    en: 'South America',
    fr: 'Amérique du Sud'
  },
  'regions.australia': {
    en: 'Australia',
    fr: 'Australie'
  },
  'regions.antarctica': {
    en: 'Antarctica',
    fr: 'Antarctique'
  },
  'regions.caribbeanpacificafrica': {
    en: 'Caribbean, Pacific, Africa',
    fr: 'Caraïbes, Pacifique, Afrique'
  },
  'regions.northernafrica': {
    en: 'Northern Africa',
    fr: 'Afrique du Nord'
  },
  'regions.westernafrica': {
    en: 'Western Africa',
    fr: 'Afrique de l\'Ouest'
  },
  'regions.easternafrica': {
    en: 'Eastern Africa',
    fr: 'Afrique de l\'Est'
  },
  'regions.centralafrica': {
    en: 'Central Africa',
    fr: 'Afrique Centrale'
  },
  'regions.southernafrica': {
    en: 'Southern Africa',
    fr: 'Afrique Australe'
  },
  'regions.caribbean': {
    en: 'Caribbean',
    fr: 'Caraïbes'
  },
  'regions.pacific': {
    en: 'Pacific',
    fr: 'Pacifique'
  },

  // Common
  'common.loading': {
    en: 'Loading...',
    fr: 'Chargement...'
  },
  'common.error': {
    en: 'Error',
    fr: 'Erreur'
  },
  'common.tryAgain': {
    en: 'Try Again',
    fr: 'Réessayer'
  },
  'common.refresh': {
    en: 'Refresh',
    fr: 'Actualiser'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.substring(0, 2);
      if (browserLang === 'fr') {
        setLanguage('fr');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};