export interface IDbApi {
    getSampleSetting: () => Promise<string>; // Add our new function
  
    // --- Add functions for all your dataService operations later ---
    // getCategories: () => Promise<Category[]>;
    // createCategory: (categoryData: Omit<Category, 'id'>) => Promise<Category>;
    // ... etc ...
  }
  
  // Declare it globally for the renderer window
  declare global {
    interface Window {
      dbApi: IDbApi;
    }
  }
  