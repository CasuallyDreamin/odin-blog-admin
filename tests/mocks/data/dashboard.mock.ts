export const mockApiHealth = (overrides?: { online: boolean; latency: number }) => ({
  online: true,
  latency: 45,
  ...overrides,
});

export const mockDashboardCounts = {
  comments: 5,
  messages: 2,
};