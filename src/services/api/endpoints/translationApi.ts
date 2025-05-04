
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
    
  removeLanguage: (language: string) => 
    handleResponse(api.delete(`/translations/languages/${language}`)),
    
  importTranslations: (language: string, data: Record<string, string>) => 
    handleResponse(api.post('/translations/import', { language, data })),
    
  exportTranslations: (language: string) => 
    handleResponse(api.get(`/translations/export/${language}`, { responseType: 'blob' })),
    
  translateMissing: (sourceLanguage: string, targetLanguage: string) => 
    handleResponse(api.post('/translations/auto-translate', { sourceLanguage, targetLanguage })),
};
