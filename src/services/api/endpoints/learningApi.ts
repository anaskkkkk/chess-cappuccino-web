
import api, { handleResponse } from '../index';

// Learning related endpoints
export const learningApi = {
  getCourses: (page = 1, limit = 10, filters = {}) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters as Record<string, string>
    });
    return handleResponse(api.get(`/courses?${queryParams}`));
  },
  
  getCourseById: (courseId: string) => 
    handleResponse(api.get(`/courses/${courseId}`)),
  
  createCourse: (courseData: any) => 
    handleResponse(api.post('/courses', courseData)),
  
  updateCourse: (courseId: string, data: any) => 
    handleResponse(api.put(`/courses/${courseId}`, data)),
  
  deleteCourse: (courseId: string) => 
    handleResponse(api.delete(`/courses/${courseId}`)),
  
  enrollInCourse: (courseId: string) => 
    handleResponse(api.post(`/courses/${courseId}/enroll`)),
  
  getPuzzles: (page = 1, limit = 10, difficulty = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(difficulty ? { difficulty } : {})
    });
    return handleResponse(api.get(`/puzzles?${queryParams}`));
  },
  
  getPuzzleById: (puzzleId: string) => 
    handleResponse(api.get(`/puzzles/${puzzleId}`)),
  
  createPuzzle: (puzzleData: any) => 
    handleResponse(api.post('/puzzles', puzzleData)),
  
  updatePuzzle: (puzzleId: string, data: any) => 
    handleResponse(api.put(`/puzzles/${puzzleId}`, data)),
  
  deletePuzzle: (puzzleId: string) => 
    handleResponse(api.delete(`/puzzles/${puzzleId}`)),
  
  solvePuzzle: (puzzleId: string, moves: string[]) => 
    handleResponse(api.post(`/puzzles/${puzzleId}/solve`, { moves })),
};
