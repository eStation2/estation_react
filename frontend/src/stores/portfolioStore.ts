import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Product,
  ProductCategory,
  PortfolioService,
  PortfolioFilter,
  PortfolioStats,
  mockProductCategories,
  mockPortfolioServices
} from '@/models/PortfolioModels';

interface PortfolioState {
  // Data
  productCategories: ProductCategory[];
  portfolioServices: PortfolioService[];
  availableProducts: Product[];
  
  // UI State
  filters: PortfolioFilter;
  selectedService: string | null;
  selectedProduct: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  filteredProducts: Product[];
  portfolioStats: PortfolioStats;
  
  // Actions
  loadPortfolioData: () => Promise<void>;
  setFilters: (filters: Partial<PortfolioFilter>) => void;
  clearFilters: () => void;
  selectService: (serviceId: string | null) => void;
  selectProduct: (productId: string | null) => void;
  addProductToService: (serviceId: string, productId: string) => void;
  removeProductFromService: (serviceId: string, productId: string) => void;
  createService: (service: Omit<PortfolioService, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (serviceId: string, updates: Partial<PortfolioService>) => void;
  deleteService: (serviceId: string) => void;
  refreshData: () => void;
  setError: (error: string | null) => void;
}

const defaultFilters: PortfolioFilter = {
  searchTerm: '',
  selectedThemes: [],
  selectedCategories: [],
  selectedRegions: [],
  showActiveOnly: false
};

const computeFilteredProducts = (
  products: Product[],
  filters: PortfolioFilter
): Product[] => {
  return products.filter(product => {
    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.metadata.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm)
        );
      if (!matchesSearch) return false;
    }
    
    // Theme filter
    if (filters.selectedThemes.length > 0) {
      if (!filters.selectedThemes.includes(product.themeGroup)) {
        return false;
      }
    }
    
    // Category filter
    if (filters.selectedCategories.length > 0) {
      if (!filters.selectedCategories.includes(product.category)) {
        return false;
      }
    }
    
    // Region filter
    if (filters.selectedRegions.length > 0) {
      const hasMatchingRegion = product.region.some(region =>
        filters.selectedRegions.includes(region)
      );
      if (!hasMatchingRegion) return false;
    }
    
    // Active only filter
    if (filters.showActiveOnly && product.status !== 'active') {
      return false;
    }
    
    return true;
  });
};

const computePortfolioStats = (
  services: PortfolioService[],
  products: Product[],
  productCategories: ProductCategory[]
): PortfolioStats => {
  const activeServices = services.filter(s => s.status === 'active').length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  
  return {
    totalServices: services.length,
    totalProducts: products.length,
    activeServices,
    activeProducts,
    productCategories: productCategories.length,
    storageUsed: Math.round(Math.random() * 1000), // Mock storage usage
    lastSyncTime: new Date()
  };
};

export const usePortfolioStore = create<PortfolioState>()(
  devtools(
    (set, get) => ({
      // Initial state
      productCategories: [],
      portfolioServices: [],
      availableProducts: [],
      filters: defaultFilters,
      selectedService: null,
      selectedProduct: null,
      isLoading: false,
      error: null,
      filteredProducts: [],
      portfolioStats: {
        totalServices: 0,
        totalProducts: 0,
        activeServices: 0,
        activeProducts: 0,
        productCategories: 0,
        storageUsed: 0,
        lastSyncTime: new Date()
      },

      // Actions
      loadPortfolioData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Load mock data (in real app, this would be API calls)
          const productCategories = mockProductCategories;
          const portfolioServices = mockPortfolioServices;
          const availableProducts = productCategories.flatMap(cat => cat.products);
          
          const state = get();
          const filteredProducts = computeFilteredProducts(availableProducts, state.filters);
          const portfolioStats = computePortfolioStats(portfolioServices, availableProducts, productCategories);
          
          set({
            productCategories,
            portfolioServices,
            availableProducts,
            filteredProducts,
            portfolioStats,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load portfolio data',
            isLoading: false
          });
        }
      },

      setFilters: (newFilters) => {
        const state = get();
        const updatedFilters = { ...state.filters, ...newFilters };
        const filteredProducts = computeFilteredProducts(state.availableProducts, updatedFilters);
        
        set({
          filters: updatedFilters,
          filteredProducts
        });
      },

      clearFilters: () => {
        const state = get();
        const filteredProducts = computeFilteredProducts(state.availableProducts, defaultFilters);
        
        set({
          filters: defaultFilters,
          filteredProducts
        });
      },

      selectService: (serviceId) => {
        set({ selectedService: serviceId });
      },

      selectProduct: (productId) => {
        set({ selectedProduct: productId });
      },

      addProductToService: (serviceId, productId) => {
        const state = get();
        const updatedServices = state.portfolioServices.map(service => {
          if (service.id === serviceId) {
            if (!service.products.includes(productId)) {
              return {
                ...service,
                products: [...service.products, productId],
                updatedAt: new Date()
              };
            }
          }
          return service;
        });
        
        const portfolioStats = computePortfolioStats(updatedServices, state.availableProducts, state.productCategories);
        
        set({
          portfolioServices: updatedServices,
          portfolioStats
        });
      },

      removeProductFromService: (serviceId, productId) => {
        const state = get();
        const updatedServices = state.portfolioServices.map(service => {
          if (service.id === serviceId) {
            return {
              ...service,
              products: service.products.filter(id => id !== productId),
              updatedAt: new Date()
            };
          }
          return service;
        });
        
        const portfolioStats = computePortfolioStats(updatedServices, state.availableProducts, state.productCategories);
        
        set({
          portfolioServices: updatedServices,
          portfolioStats
        });
      },

      createService: (serviceData) => {
        const state = get();
        const newService: PortfolioService = {
          ...serviceData,
          id: `service-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const updatedServices = [...state.portfolioServices, newService];
        const portfolioStats = computePortfolioStats(updatedServices, state.availableProducts, state.productCategories);
        
        set({
          portfolioServices: updatedServices,
          portfolioStats
        });
      },

      updateService: (serviceId, updates) => {
        const state = get();
        const updatedServices = state.portfolioServices.map(service => {
          if (service.id === serviceId) {
            return {
              ...service,
              ...updates,
              updatedAt: new Date()
            };
          }
          return service;
        });
        
        const portfolioStats = computePortfolioStats(updatedServices, state.availableProducts, state.productCategories);
        
        set({
          portfolioServices: updatedServices,
          portfolioStats
        });
      },

      deleteService: (serviceId) => {
        const state = get();
        const updatedServices = state.portfolioServices.filter(service => 
          service.id !== serviceId
        );
        
        const portfolioStats = computePortfolioStats(updatedServices, state.availableProducts);
        
        set({
          portfolioServices: updatedServices,
          portfolioStats,
          selectedService: state.selectedService === serviceId ? null : state.selectedService
        });
      },

      refreshData: () => {
        get().loadPortfolioData();
      },

      setError: (error) => {
        set({ error });
      }
    }),
    {
      name: 'portfolio-store',
      partialize: (state) => ({
        filters: state.filters,
        selectedService: state.selectedService,
        selectedProduct: state.selectedProduct
      })
    }
  )
);