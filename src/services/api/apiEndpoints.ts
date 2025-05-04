
// Main index file that exports all API endpoints from domain-specific files
import { userApi } from './endpoints/userApi';
import { gameApi } from './endpoints/gameApi';
import { tournamentApi } from './endpoints/tournamentApi';
import { learningApi } from './endpoints/learningApi';
import { storeApi } from './endpoints/storeApi';
import { smartBoardApi } from './endpoints/smartBoardApi';
import { adminApi } from './endpoints/adminApi';
import { contentApi } from './endpoints/contentApi';
import { translationApi } from './endpoints/translationApi';
import { analyticsApi } from './endpoints/analyticsApi';
import { websocketApi } from './endpoints/websocketApi';
import { integrationsApi } from './endpoints/integrationsApi';
import { notificationsApi } from './endpoints/notificationsApi';
import { taskApi } from './endpoints/taskApi';

export {
  userApi,
  gameApi,
  tournamentApi,
  learningApi,
  storeApi,
  smartBoardApi,
  adminApi,
  contentApi,
  translationApi,
  analyticsApi,
  websocketApi,
  integrationsApi,
  notificationsApi,
  taskApi
};
