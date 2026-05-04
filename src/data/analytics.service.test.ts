import { getAnalytics, logEvent } from 'firebase/analytics';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { logAppError } from './analytics.service';

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(),
}));

let mockAnalyticsInstance: any = null;

vi.mock('./firebase', () => ({
  get analytics() {
    return mockAnalyticsInstance;
  },
}));

describe('analytics.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAnalyticsInstance = null;
    (logEvent as Mock).mockClear();
    (getAnalytics as Mock).mockClear();
  });

  it('deve chamar logEvent com os parâmetros corretos quando analytics está disponível', () => {
    const mockAnalytics = {};
    mockAnalyticsInstance = mockAnalytics;

    const mockError = new Error('Test Error');
    const mockMetadata = { component: 'TestComponent' };

    logAppError('TestContext', mockError, mockMetadata);

    expect(logEvent).toHaveBeenCalledWith(mockAnalyticsInstance, 'exception', {
      description: 'Test Error',
      context: 'TestContext',
      component: 'TestComponent',
    });
  });

  it('não deve chamar logEvent quando analytics não está disponível (null)', () => {
    const mockError = 'Another Error';
    logAppError('AnotherContext', mockError);

    expect(logEvent).not.toHaveBeenCalled();
  });

  it('deve converter o erro para string se não for uma instância de Error', () => {
    const instance = {};
    mockAnalyticsInstance = instance;

    const mockErrorString = 'Just a string error';
    logAppError('StringErrorContext', mockErrorString);

    expect(logEvent).toHaveBeenCalledWith(mockAnalyticsInstance, 'exception', {
      description: 'Just a string error',
      context: 'StringErrorContext',
    });
  });
});
