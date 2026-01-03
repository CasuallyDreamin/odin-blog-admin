import { authHandlers } from './auth';
import { postHandlers } from './posts';
import { commentHandlers } from './comments';
import { contactHandlers } from './contact';
import { settingsHandlers } from './settings';
import { tagHandlers } from './tags';
import { categoryHandlers } from './categories';
import { projectHandlers } from './projects';
import { quoteHandlers } from './quotes';

export const handlers = [
  ...authHandlers,
  ...postHandlers,
  ...commentHandlers,
  ...contactHandlers,
  ...settingsHandlers,
  ...tagHandlers,
  ...categoryHandlers,
  ...projectHandlers,
  ...quoteHandlers,
];