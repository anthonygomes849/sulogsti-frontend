import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';

// Mock context providers for testing
const MockAuthenticateProvider = ({ children }: { children: ReactNode }) => (
  <div data-testid="auth-provider">{children}</div>
);

const MockStatusProvider = ({ children }: { children: ReactNode }) => (
  <div data-testid="status-provider">{children}</div>
);

const MockErrorProvider = ({ children }: { children: ReactNode }) => (
  <div data-testid="error-provider">{children}</div>
);

const MockModalProvider = ({ children }: { children: ReactNode }) => (
  <div data-testid="modal-provider">{children}</div>
);

// Create wrapper with all providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <MockAuthenticateProvider>
      <MockStatusProvider>
        <MockErrorProvider>
          <MockModalProvider>
            {children}
          </MockModalProvider>
        </MockErrorProvider>
      </MockStatusProvider>
    </MockAuthenticateProvider>
  );
};

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock form data for testing
export const mockFormData = {
  data_agendamento_terminal: '2024-01-01T10:00',
  placa_dianteira_veiculo: 'ABC-1234',
  placa_traseira_veiculo: 'DEF-5678',
  identificadores_conteineres: 'AAAA-1234567,BBBB-7654321',
  tipo_carga: '1',
  tipo_operacao: '1',
  id_terminal: '1',
  tolerancia_inicial: '30',
  tolerancia_final: '60',
  cpf_motorista: '123.456.789-00',
  cnpj_transportadora: '12.345.678/0001-99',
};

// Mock terminal data
export const mockTerminais = [
  {
    label: 'Terminal 1',
    value: 1,
    tipos_carga: '{1,2,3}'
  },
  {
    label: 'Terminal 2', 
    value: 2,
    tipos_carga: '{1,3}'
  }
];

// Mock API responses
export const mockApiResponses = {
  terminaisSuccess: {
    status: 200,
    data: {
      data: [
        {
          id_terminal: 1,
          razao_social: 'Terminal 1',
          tipos_carga: '{1,2,3}'
        },
        {
          id_terminal: 2,
          razao_social: 'Terminal 2',
          tipos_carga: '{1,3}'
        }
      ]
    }
  },
  createSuccess: {
    status: 200,
    data: { message: 'Success' }
  },
  updateSuccess: {
    status: 200,
    data: { message: 'Updated successfully' }
  },
  errorResponse: {
    status: 400,
    data: { error: 'Validation error' }
  }
};

// Mock props for Form component
export const mockFormProps = {
  onConfirm: vi.fn(),
  onClose: vi.fn(),
  isView: false,
  isEdit: false,
  selectedRow: undefined
};

// Mock edit props with selected row
export const mockEditProps = {
  ...mockFormProps,
  isEdit: true,
  selectedRow: {
    id_operacao_porto_agendada: 1,
    data_agendamento_terminal: '2024-01-01T10:00',
    placa_dianteira_veiculo: 'ABC-1234',
    placa_traseira_veiculo: 'DEF-5678',
    identificadores_conteineres: '{AAAA-1234567,BBBB-7654321}',
    tipo_carga: 1,
    tipo_operacao: 1,
    id_terminal: 1,
    tolerancia_inicio_agendamento: 30,
    tolerancia_fim_agendamento: 60,
    cpf_motorista: '123.456.789-00',
    cnpj_transportadora: '12.345.678/0001-99',
    terminal: {
      id_terminal: 1,
      razao_social: 'Terminal Test'
    },
    transportadora: {
      id_transportadora: 1,
      razao_social: 'Transportadora Test',
      nome_fantasia: 'Transportadora',
      cnpj: '12.345.678/0001-99'
    },
    data_historico: '2024-01-01'
  }
};

// Mock view props
export const mockViewProps = {
  ...mockEditProps,
  isView: true,
  isEdit: false
};

// Helper functions for testing
export const waitForFormLoad = () => new Promise(resolve => setTimeout(resolve, 100));

export const fillFormField = async (getByTestId: any, fieldName: string, value: string) => {
  const field = getByTestId(fieldName);
  field.value = value;
  field.dispatchEvent(new Event('change', { bubbles: true }));
};

// Export everything we might need
export * from '@testing-library/react';
export { customRender as render };
export { vi };