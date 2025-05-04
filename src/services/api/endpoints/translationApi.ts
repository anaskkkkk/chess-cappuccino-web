
import api, { handleResponse } from '../index';

// Translation related endpoints
export const translationApi = {
  getLanguages: () => 
    handleResponse(api.get('/translations/languages')),
  
  getTranslations: (language: string, keys: string[] = []) => 
    handleResponse(api.post('/translations', { language, keys })),
  
  updateTranslation: (language: string, key: string, value: string) => 
    handleResponse(api.put('/translations', { language, key, value })),
  
  addLanguage: (language: string, name: string) => 
    handleResponse(api.post('/translations/languages', { language, name })),
};
