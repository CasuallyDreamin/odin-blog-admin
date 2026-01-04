import { http, HttpResponse } from 'msw';
import { mockSettings } from '../data/settings.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let dynamicSettings = { ...mockSettings };

export const resetSettingsMocks = () => {
  dynamicSettings = { ...mockSettings };
};

export const settingsHandlers = [
  http.get(`${API_URL}/settings`, () => {
    return HttpResponse.json(dynamicSettings);
  }),

  http.put(`${API_URL}/settings`, async ({ request }) => {
    const updates = await request.json() as any;
    dynamicSettings = {
      ...dynamicSettings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return HttpResponse.json(dynamicSettings);
  }),
];