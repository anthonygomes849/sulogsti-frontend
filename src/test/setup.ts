import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock window.location for tests
Object.defineProperty(window, 'location', {
  value: {
    search: '',
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
  },
  writable: true,
});

// Mock URLSearchParams for tests
global.URLSearchParams = vi.fn().mockImplementation((search) => ({
  get: vi.fn().mockReturnValue(null),
  set: vi.fn(),
  toString: vi.fn().mockReturnValue(''),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  ToastContainer: vi.fn(() => null),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock react-loading
vi.mock('react-loading', () => ({
  default: vi.fn(() => null),
}));

// Mock API
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock notifications
vi.mock('../shared/Notification', () => ({
  FrontendNotification: vi.fn(),
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, pattern) => '2024-01-01 10:00:00'),
  ptBR: {},
}));

// Mock react-input-mask
vi.mock('react-input-mask', () => ({
  __esModule: true,
  default: vi.fn((props) => {
    if (typeof props.children === 'function') {
      // Caso esteja usando render props
      return props.children(props);
    }
    // Caso contrário, só retorna um input "fake"
    return React.createElement('input', props);
  }),
}));