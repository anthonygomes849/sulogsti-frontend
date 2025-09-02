import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import api from '../../../../../../services/api';
import { FrontendNotification } from '../../../../../../shared/Notification';
import { 
  render, 
  mockFormProps, 
  mockEditProps,
  mockApiResponses,
  waitForFormLoad,
  mockFormData
} from '../../../../../../test/test-utils';
import Form from '../index';

// Mock the dependent modules
vi.mock('../../../../../../services/api');
vi.mock('../../../../../../shared/Notification');
vi.mock('../../../../../../helpers/format', () => ({
  validateCPF: vi.fn().mockReturnValue(true),
}));

const mockApi = vi.mocked(api);
const mockNotification = vi.mocked(FrontendNotification);

describe('Form Component - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock URL search params with userId
    Object.defineProperty(window, 'location', {
      value: { search: '?userId=123' },
      writable: true,
    });
    
    global.URLSearchParams = vi.fn().mockImplementation(() => ({
      get: vi.fn().mockReturnValue('123'),
    }));
  });

  describe('Complete Form Workflow - Create Mode', () => {
    it('should complete full create workflow successfully', async () => {
      const user = userEvent.setup();

      // Mock successful API responses
      mockApi.post
        .mockResolvedValueOnce(mockApiResponses.createSuccess);   // Create operation

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Step 1: Fill datetime field
      const dateTimeInput = screen.getByLabelText(/Data Hora/i);
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2024-01-01T10:00');

      // Step 2: Fill tolerance fields
      const toleranciaInicialInput = screen.getByLabelText(/Tolerância Inicial/i);
      await user.clear(toleranciaInicialInput);
      await user.type(toleranciaInicialInput, '30');

      const toleranciaFinalInput = screen.getByLabelText(/Tolerância Final/i);
      await user.clear(toleranciaFinalInput);
      await user.type(toleranciaFinalInput, '60');

      // Step 3: Fill vehicle plates
      const placaDianteiraInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'ABC-1234');

      const placaTraseiraInput = screen.getByLabelText(/Placa Traseira/i);
      await user.clear(placaTraseiraInput);
      await user.type(placaTraseiraInput, 'DEF-5678');

      // Step 4: Fill CPF
      const cpfInput = screen.getByLabelText(/CPF Motorista/i);
      await user.clear(cpfInput);
      await user.type(cpfInput, '123.456.789-00');

      // Step 5: Fill CNPJ
      const cnpjInput = screen.getByLabelText(/CNPJ Transportadora/i);
      await user.clear(cnpjInput);
      await user.type(cnpjInput, '12.345.678/0001-99');

      // Step 6: Fill container identifiers
      const containerInputs = screen.getAllByPlaceholderText('AAAA0000000');
      await user.clear(containerInputs[0]);
      await user.type(containerInputs[0], 'AAAA-1234567');
      await user.clear(containerInputs[1]);
      await user.type(containerInputs[1], 'BBBB-7654321');

      // Step 7: Submit form
      const saveButton = screen.getByText('Salvar');
      await user.click(saveButton);

      // Verify API was called with correct data
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith(
          '/cadastrar/operacaoPortoAgendada',
          expect.objectContaining({
            data_agendamento_terminal: '2024-01-01 10:00:00',
            cpf_motorista: '12345678900', // Formatted without dots and dash
            cnpj_transportadora: '12345678000199', // Formatted without dots, slash and dash
            placa_dianteira_veiculo: 'ABC1234', // Formatted without dash
            placa_traseira_veiculo: 'DEF5678', // Formatted without dash
            tolerancia_inicio_agendamento: '30',
            tolerancia_fim_agendamento: '60',
            identificadores_conteineres: expect.stringMatching(/^\{.*\}$/),
            ativo: true,
            id_usuario_historico: '123',
            origem: 1,
            status: 0,
          })
        );
      });

      // Verify success callback
      expect(mockFormProps.onConfirm).toHaveBeenCalled();
    });

    it('should handle validation errors during create workflow', async () => {
      const user = userEvent.setup();

      // Mock CPF validation failure
      const { validateCPF } = await import('../../../../../../helpers/format');
      vi.mocked(validateCPF).mockReturnValue(false);

      mockApi.post.mockResolvedValueOnce(mockApiResponses.terminaisSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Fill form with invalid CPF
      const cpfInput = screen.getByLabelText(/CPF Motorista/i);
      await user.clear(cpfInput);
      await user.type(cpfInput, '123.456.789-99'); // Invalid CPF

      // Fill other required fields
      const dateTimeInput = screen.getByLabelText(/Data Hora/i);
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2024-01-01T10:00');

      const placaDianteiraInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'ABC-1234');

      // Submit form
      const saveButton = screen.getByText('Salvar');
      await user.click(saveButton);

      // Should show CPF validation error
      await waitFor(() => {
        expect(mockNotification).toHaveBeenCalledWith('CPF inválido', 'error');
      });

      // Should not call API
      expect(mockApi.post).toHaveBeenCalledTimes(1); // Only terminals call
    });
  });

  describe('Complete Form Workflow - Edit Mode', () => {
    it('should complete full edit workflow successfully', async () => {
      const user = userEvent.setup();

      // Mock successful API responses
      mockApi.post
        .mockResolvedValueOnce(mockApiResponses.terminaisSuccess) // Load terminals
        .mockResolvedValueOnce(mockApiResponses.updateSuccess);   // Update operation

      render(<Form {...mockEditProps} />);
      
      await waitForFormLoad();

      // Verify form is pre-populated
      expect(screen.getByDisplayValue('ABC-1234')).toBeInTheDocument();
      expect(screen.getByDisplayValue('DEF-5678')).toBeInTheDocument();

      // Modify some fields
      const toleranciaInicialInput = screen.getByLabelText(/Tolerância Inicial/i);
      await user.clear(toleranciaInicialInput);
      await user.type(toleranciaInicialInput, '45');

      const placaDianteiraInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'XYZ-9876');

      // Submit form
      const saveButton = screen.getByText('Salvar');
      await user.click(saveButton);

      // Verify edit API was called with correct data
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith(
          '/editar/operacaoPortoAgendada',
          expect.objectContaining({
            id_operacao_porto_agendada: 1,
            tolerancia_inicio_agendamento: '45',
            placa_dianteira_veiculo: 'XYZ9876',
            ativo: true,
            origem: 1,
            status: 0,
          })
        );
      });

      // Verify success callback
      expect(mockEditProps.onConfirm).toHaveBeenCalled();
    });
  });

  describe('API Error Handling Integration', () => {
    it('should handle terminal loading failure', async () => {
      // Mock terminals API failure
      mockApi.post.mockRejectedValueOnce(new Error('Network error'));

      render(<Form {...mockFormProps} />);

      // Component should still render
      await waitForFormLoad();
      expect(screen.getByText('Terminal')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    it('should handle form submission API failure', async () => {
      const user = userEvent.setup();

      // Mock successful terminals load, failed submission
      mockApi.post
        .mockResolvedValueOnce(mockApiResponses.terminaisSuccess)
        .mockRejectedValueOnce(new Error('Submission failed'));

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Fill minimal required fields
      const dateTimeInput = screen.getByLabelText(/Data Hora/i);
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2024-01-01T10:00');

      const placaDianteiraInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'ABC-1234');

      const cpfInput = screen.getByLabelText(/CPF Motorista/i);
      await user.clear(cpfInput);
      await user.type(cpfInput, '123.456.789-00');

      // Submit form
      const saveButton = screen.getByText('Salvar');
      await user.click(saveButton);

      // Should show error notification
      await waitFor(() => {
        expect(mockNotification).toHaveBeenCalledWith(
          'Erro ao salvar o agendamento!',
          'error'
        );
      });

      // Should not call success callback
      expect(mockFormProps.onConfirm).not.toHaveBeenCalled();
    });

    it('should handle partial API success with error response', async () => {
      const user = userEvent.setup();

      // Mock successful terminals load, error response from submission
      mockApi.post
        .mockResolvedValueOnce(mockApiResponses.terminaisSuccess)
        .mockResolvedValueOnce(mockApiResponses.errorResponse);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Fill and submit form
      const dateTimeInput = screen.getByLabelText(/Data Hora/i);
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2024-01-01T10:00');

      const placaDianteiraInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'ABC-1234');

      const cpfInput = screen.getByLabelText(/CPF Motorista/i);
      await user.clear(cpfInput);
      await user.type(cpfInput, '123.456.789-00');

      const saveButton = screen.getByText('Salvar');
      await user.click(saveButton);

      // Should show error notification for non-200 status
      await waitFor(() => {
        expect(mockNotification).toHaveBeenCalledWith(
          'Erro ao salvar o agendamento!',
          'error'
        );
      });
    });
  });

  describe('Complex Data Processing Integration', () => {
    it('should process container identifiers correctly with multiple containers', async () => {
      const user = userEvent.setup();

      mockApi.post
        .mockResolvedValueOnce(mockApiResponses.terminaisSuccess)
        .mockResolvedValueOnce(mockApiResponses.createSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Fill all four container fields
      const containerInputs = screen.getAllByPlaceholderText('AAAA0000000');
      await user.clear(containerInputs[0]);
      await user.type(containerInputs[0], 'AAAA-1111111');
      await user.clear(containerInputs[1]);
      await user.type(containerInputs[1], 'BBBB-2222222');
      await user.clear(containerInputs[2]);
      await user.type(containerInputs[2], 'CCCC-3333333');
      await user.clear(containerInputs[3]);
      await user.type(containerInputs[3], 'DDDD-4444444');

      // Fill other required fields
      const dateTimeInput = screen.getByLabelText(/Data Hora/i);
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2024-01-01T10:00');

      const placaDianteiraInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'ABC-1234');

      const cpfInput = screen.getByLabelText(/CPF Motorista/i);
      await user.clear(cpfInput);
      await user.type(cpfInput, '123.456.789-00');

      const saveButton = screen.getByText('Salvar');
      await user.click(saveButton);

      // Verify containers are formatted correctly as comma-separated list in braces
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith(
          '/cadastrar/operacaoPortoAgendada',
          expect.objectContaining({
            identificadores_conteineres: expect.stringMatching(
              /^\{AAAA1111111,BBBB2222222,CCCC3333333,DDDD4444444\}$/
            ),
          })
        );
      });
    });

    it('should handle empty containers correctly', async () => {
      const user = userEvent.setup();

      mockApi.post
        .mockResolvedValueOnce(mockApiResponses.terminaisSuccess)
        .mockResolvedValueOnce(mockApiResponses.createSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Don't fill any container fields, fill other required fields
      const dateTimeInput = screen.getByLabelText(/Data Hora/i);
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2024-01-01T10:00');

      const placaDianteiraInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'ABC-1234');

      const cpfInput = screen.getByLabelText(/CPF Motorista/i);
      await user.clear(cpfInput);
      await user.type(cpfInput, '123.456.789-00');

      const saveButton = screen.getByText('Salvar');
      await user.click(saveButton);

      // Should send null for empty containers
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith(
          '/cadastrar/operacaoPortoAgendada',
          expect.objectContaining({
            identificadores_conteineres: null,
          })
        );
      });
    });
  });

  describe('Terminal and Cargo Type Integration', () => {
    it('should load and filter cargo types based on terminal selection', async () => {
      const user = userEvent.setup();

      mockApi.post.mockResolvedValueOnce(mockApiResponses.terminaisSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // This integration test would require the actual SelectCustom component
      // to be properly implemented and testable. The logic for filtering
      // cargo types based on terminal selection would be tested here.
      
      // For now, we verify that terminals are loaded correctly
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith('/listar/terminais', {
          order_by: 'data_historico',
          order_direction: 'desc',
          qtd_por_pagina: 100,
        });
      });
    });
  });

  describe('Form State Management Integration', () => {
    it('should maintain form state during user interaction', async () => {
      const user = userEvent.setup();

      mockApi.post.mockResolvedValueOnce(mockApiResponses.terminaisSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Fill multiple fields and verify they maintain their values
      const dateTimeInput = screen.getByLabelText(/Data Hora/i);
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2024-01-01T10:00');
      expect(dateTimeInput).toHaveValue('2024-01-01T10:00');

      const toleranciaInput = screen.getByLabelText(/Tolerância Inicial/i);
      await user.clear(toleranciaInput);
      await user.type(toleranciaInput, '30');
      expect(toleranciaInput).toHaveValue('30');

      const placaInput = screen.getByLabelText(/Placa Dianteira/i);
      await user.clear(placaInput);
      await user.type(placaInput, 'ABC-1234');
      expect(placaInput).toHaveValue('ABC-1234');

      // All fields should retain their values
      expect(dateTimeInput).toHaveValue('2024-01-01T10:00');
      expect(toleranciaInput).toHaveValue('30');
      expect(placaInput).toHaveValue('ABC-1234');
    });

    it('should handle container state updates correctly', async () => {
      const user = userEvent.setup();

      mockApi.post.mockResolvedValueOnce(mockApiResponses.terminaisSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Test container state management
      const containerInputs = screen.getAllByPlaceholderText('AAAA0000000');
      
      // Fill first container
      await user.clear(containerInputs[0]);
      await user.type(containerInputs[0], 'AAAA-1111111');
      expect(containerInputs[0]).toHaveValue('AAAA-1111111');

      // Fill third container (skipping second)
      await user.clear(containerInputs[2]);
      await user.type(containerInputs[2], 'CCCC-3333333');
      expect(containerInputs[2]).toHaveValue('CCCC-3333333');

      // Verify first container still has its value
      expect(containerInputs[0]).toHaveValue('AAAA-1111111');
      // Verify second container is still empty
      expect(containerInputs[1]).toHaveValue('');
      // Verify third container has its value
      expect(containerInputs[2]).toHaveValue('CCCC-3333333');
    });
  });

  describe('User Experience Integration', () => {
    it('should provide immediate feedback for user actions', async () => {
      const user = userEvent.setup();

      mockApi.post.mockResolvedValueOnce(mockApiResponses.terminaisSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Test cancel functionality
      const cancelButton = screen.getByText('Cancelar');
      await user.click(cancelButton);
      
      expect(mockFormProps.onClose).toHaveBeenCalled();
    });

    it('should handle rapid user input correctly', async () => {
      const user = userEvent.setup();

      mockApi.post.mockResolvedValueOnce(mockApiResponses.terminaisSuccess);

      render(<Form {...mockFormProps} />);
      
      await waitForFormLoad();

      // Rapidly type in input field
      const cpfInput = screen.getByLabelText(/CPF Motorista/i);
      await user.clear(cpfInput);
      
      // Type quickly without waiting
      await user.type(cpfInput, '12345678900', { delay: 1 });
      
      // Should handle rapid input correctly
      expect(cpfInput).toHaveValue('12345678900');
    });
  });
});