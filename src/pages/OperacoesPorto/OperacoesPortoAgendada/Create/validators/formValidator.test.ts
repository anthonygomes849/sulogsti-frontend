import { describe, expect, it } from 'vitest';
import formValidator from '../validators/formValidator';
import formValidator2 from '../validators/formValidator2';

describe('Form Validators', () => {
  describe('formValidator (standard validation)', () => {
    const validData = {
      data_agendamento_terminal: '2024-01-01T10:00',
      placa_dianteira_veiculo: 'ABC-1234',
      placa_traseira_veiculo: 'DEF-5678',
      tipo_carga: 1,
      tipo_operacao: 1,
      id_terminal: 1,
      tolerancia_inicial: 30,
      tolerancia_final: 60,
      cpf_motorista: '123.456.789-00',
    };

    it('should validate correct data successfully', async () => {
      await expect(formValidator.validate(validData)).resolves.toBeTruthy();
    });

    it('should require data_agendamento_terminal', async () => {
      const invalidData = { ...validData, data_agendamento_terminal: '' };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should require placa_dianteira_veiculo', async () => {
      const invalidData = { ...validData, placa_dianteira_veiculo: '' };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should not require placa_traseira_veiculo', async () => {
      const dataWithoutRearPlate = { ...validData, placa_traseira_veiculo: '' };
      
      await expect(formValidator.validate(dataWithoutRearPlate)).resolves.toBeTruthy();
    });

    it('should require tipo_carga', async () => {
      const invalidData = { ...validData, tipo_carga: undefined };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should require tipo_operacao', async () => {
      const invalidData = { ...validData, tipo_operacao: undefined };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should require id_terminal', async () => {
      const invalidData = { ...validData, id_terminal: undefined };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should require tolerancia_inicial', async () => {
      const invalidData = { ...validData, tolerancia_inicial: undefined };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should require tolerancia_final', async () => {
      const invalidData = { ...validData, tolerancia_final: undefined };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should require cpf_motorista', async () => {
      const invalidData = { ...validData, cpf_motorista: '' };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should validate numeric fields correctly', async () => {
      const dataWithStringNumbers = {
        ...validData,
        tipo_carga: '1',
        tipo_operacao: '2',
        id_terminal: '3',
        tolerancia_inicial: '30',
        tolerancia_final: '60',
      };
      
      await expect(formValidator.validate(dataWithStringNumbers)).resolves.toBeTruthy();
    });

    it('should reject invalid numeric fields', async () => {
      const invalidData = { ...validData, tipo_carga: 'invalid' };
      
      await expect(formValidator.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('formValidator2 (combustível validation - requires rear plate)', () => {
    const validData = {
      data_agendamento_terminal: '2024-01-01T10:00',
      placa_dianteira_veiculo: 'ABC-1234',
      placa_traseira_veiculo: 'DEF-5678',
      tipo_carga: 2, // Combustível
      tipo_operacao: 1,
      id_terminal: 1,
      tolerancia_inicial: 30,
      tolerancia_final: 60,
      cpf_motorista: '123.456.789-00',
    };

    it('should validate correct data with rear plate successfully', async () => {
      await expect(formValidator2.validate(validData)).resolves.toBeTruthy();
    });

    it('should require placa_traseira_veiculo for combustível', async () => {
      const invalidData = { ...validData, placa_traseira_veiculo: '' };
      
      await expect(formValidator2.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should require all standard fields like formValidator', async () => {
      const invalidData = { ...validData, cpf_motorista: '' };
      
      await expect(formValidator2.validate(invalidData)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should handle partial data correctly', async () => {
      const partialData = {
        data_agendamento_terminal: '2024-01-01T10:00',
        placa_dianteira_veiculo: 'ABC-1234',
        tipo_carga: 2,
      };
      
      await expect(formValidator2.validate(partialData)).rejects.toThrow('Este campo é obrigatório!');
    });
  });

  describe('Validator comparison', () => {
    it('should have different requirements for placa_traseira_veiculo', async () => {
      const dataWithoutRearPlate = {
        data_agendamento_terminal: '2024-01-01T10:00',
        placa_dianteira_veiculo: 'ABC-1234',
        placa_traseira_veiculo: '',
        tipo_carga: 1,
        tipo_operacao: 1,
        id_terminal: 1,
        tolerancia_inicial: 30,
        tolerancia_final: 60,
        cpf_motorista: '123.456.789-00',
      };

      // formValidator should allow empty rear plate
      await expect(formValidator.validate(dataWithoutRearPlate)).resolves.toBeTruthy();

      // formValidator2 should require rear plate
      await expect(formValidator2.validate(dataWithoutRearPlate)).rejects.toThrow('Este campo é obrigatório!');
    });

    it('should both accept valid complete data', async () => {
      const completeData = {
        data_agendamento_terminal: '2024-01-01T10:00',
        placa_dianteira_veiculo: 'ABC-1234',
        placa_traseira_veiculo: 'DEF-5678',
        tipo_carga: 1,
        tipo_operacao: 1,
        id_terminal: 1,
        tolerancia_inicial: 30,
        tolerancia_final: 60,
        cpf_motorista: '123.456.789-00',
      };

      await expect(formValidator.validate(completeData)).resolves.toBeTruthy();
      await expect(formValidator2.validate(completeData)).resolves.toBeTruthy();
    });

    it('should both reject data missing required fields', async () => {
      const incompleteData = {
        placa_dianteira_veiculo: 'ABC-1234',
        // Missing other required fields
      };

      await expect(formValidator.validate(incompleteData)).rejects.toThrow();
      await expect(formValidator2.validate(incompleteData)).rejects.toThrow();
    });
  });

  describe('Field type validation', () => {
    it('should validate string fields correctly', async () => {
      const validStringData = {
        data_agendamento_terminal: '2024-01-01T10:00',
        placa_dianteira_veiculo: 'ABC-1234',
        placa_traseira_veiculo: 'DEF-5678',
        cpf_motorista: '123.456.789-00',
        tipo_carga: 1,
        tipo_operacao: 1,
        id_terminal: 1,
        tolerancia_inicial: 30,
        tolerancia_final: 60,
      };

      await expect(formValidator.validate(validStringData)).resolves.toBeTruthy();
    });

    it('should validate number fields correctly', async () => {
      const validNumberData = {
        data_agendamento_terminal: '2024-01-01T10:00',
        placa_dianteira_veiculo: 'ABC-1234',
        cpf_motorista: '123.456.789-00',
        tipo_carga: 1,
        tipo_operacao: 2,
        id_terminal: 3,
        tolerancia_inicial: 30,
        tolerancia_final: 60,
      };

      await expect(formValidator.validate(validNumberData)).resolves.toBeTruthy();
    });

    it('should reject null or undefined required values', async () => {
      const dataWithNulls = {
        data_agendamento_terminal: null,
        placa_dianteira_veiculo: undefined,
        cpf_motorista: '',
        tipo_carga: null,
        tipo_operacao: undefined,
        id_terminal: 0,
        tolerancia_inicial: null,
        tolerancia_final: undefined,
      };

      await expect(formValidator.validate(dataWithNulls)).rejects.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty object', async () => {
      await expect(formValidator.validate({})).rejects.toThrow();
      await expect(formValidator2.validate({})).rejects.toThrow();
    });

    it('should handle null input', async () => {
      await expect(formValidator.validate(null)).rejects.toThrow();
      await expect(formValidator2.validate(null)).rejects.toThrow();
    });

    it('should handle undefined input', async () => {
      await expect(formValidator.validate(undefined)).rejects.toThrow();
      await expect(formValidator2.validate(undefined)).rejects.toThrow();
    });

    it('should handle extra fields gracefully', async () => {
      const dataWithExtraFields = {
        data_agendamento_terminal: '2024-01-01T10:00',
        placa_dianteira_veiculo: 'ABC-1234',
        placa_traseira_veiculo: 'DEF-5678',
        tipo_carga: 1,
        tipo_operacao: 1,
        id_terminal: 1,
        tolerancia_inicial: 30,
        tolerancia_final: 60,
        cpf_motorista: '123.456.789-00',
        extra_field: 'should be ignored',
        another_extra: 123,
      };

      await expect(formValidator.validate(dataWithExtraFields)).resolves.toBeTruthy();
      await expect(formValidator2.validate(dataWithExtraFields)).resolves.toBeTruthy();
    });

    it('should validate with zero values correctly', async () => {
      const dataWithZeros = {
        data_agendamento_terminal: '2024-01-01T10:00',
        placa_dianteira_veiculo: 'ABC-1234',
        placa_traseira_veiculo: 'DEF-5678',
        tipo_carga: 0,
        tipo_operacao: 0,
        id_terminal: 0,
        tolerancia_inicial: 0,
        tolerancia_final: 0,
        cpf_motorista: '123.456.789-00',
      };

      // Zero is a valid number, so this should pass
      await expect(formValidator.validate(dataWithZeros)).resolves.toBeTruthy();
      await expect(formValidator2.validate(dataWithZeros)).resolves.toBeTruthy();
    });
  });
});