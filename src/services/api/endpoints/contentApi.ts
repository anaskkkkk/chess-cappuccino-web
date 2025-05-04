
import api, { handleResponse } from '../index';

// Content management endpoints
export const contentApi = {
  getPages: (page = 1, limit = 10) => 
    handleResponse(api.get(`/content/pages?page=${page}&limit=${limit}`)),
  
  getPageById: (pageId: string) => 
    handleResponse(api.get(`/content/pages/${pageId}`)),
  
  createPage: (pageData: any) => 
    handleResponse(api.post('/content/pages', pageData)),
  
  updatePage: (pageId: string, data: any) => 
    handleResponse(api.put(`/content/pages/${pageId}`, data)),
  
  deletePage: (pageId: string) => 
    handleResponse(api.delete(`/content/pages/${pageId}`)),
  
  publishPage: (pageId: string) => 
    handleResponse(api.put(`/content/pages/${pageId}/publish`)),
  
  unpublishPage: (pageId: string) => 
    handleResponse(api.put(`/content/pages/${pageId}/unpublish`)),
};
