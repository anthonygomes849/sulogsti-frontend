import { beforeEach, it, vi } from "vitest";
import api from "../../../../../../services/api";
import { FrontendNotification } from "../../../../../../shared/Notification";
import { describe } from "node:test";
import userEvent from "@testing-library/user-event";
import { mockFormProps, mockTerminais, waitForFormLoad } from "../../../../../../test/test-utils";
import Form from '../index';
import { render, screen } from "@testing-library/react";
import SelectCustom from "../../../../../../components/SelectCustom";

const mockApi = vi.mocked(api);
const mockNotification = vi.mocked(FrontendNotification)


describe('Form Component - Operacao Porto Agendada', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, 'location', {
      value: { search: '?userId=123' },
      writable: true,
    });

    global.URLSearchParams = vi.fn().mockImplementation(() => ({
      get: vi.fn().mockReturnValue('123'),
    }));
  });

  describe('Render Form - Create', () => {
    it('should create action successfully', async () => {
      const user = userEvent.setup();

      render(<Form {...mockFormProps} />)

      await waitForFormLoad();

      const mockApiTerminais = mockTerminais;

      const dateTimeInput = screen.getByTestId('dataHora');
      await user.clear(dateTimeInput);
      await user.type(dateTimeInput, '2023-01-01T10:00');

      const toleranciaInicialInput = screen.getByTestId('toleranciaInicial');
      await user.clear(toleranciaInicialInput);
      await user.type(toleranciaInicialInput, '30');

      const toleranciaFinalInput = screen.getByTestId('toleranciaFinal');
      await user.clear(toleranciaFinalInput);
      await user.type(toleranciaFinalInput, '30');

      const placaDianteiraInput = screen.getByTestId('placaDianteira');
      await user.clear(placaDianteiraInput);
      await user.type(placaDianteiraInput, 'ABC-1234');

      const placaTraseiraInput = screen.getByTestId('placaDianteira');
      await user.clear(placaTraseiraInput);
      await user.type(placaTraseiraInput, 'DEF-5678');


      // await user.selectOptions(terminalSelect, '1')
    })
  })

})