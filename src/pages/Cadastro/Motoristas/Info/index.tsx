import React from 'react';
import { useLocation } from 'react-router-dom';


const InfoVeiculo: React.FC = () => {

  const { state: { data } } = useLocation();


  console.log(data);
  return (
    <div className='flex items-center p-16'>
      <div className='w-[570px] h-auto flex flex-col' style={{ border: '1px solid rgba(0,0,0,.125)', borderRadius: '4px' }}>
        <div className='bg-[#fafafa] ' style={{ padding: '.5rem 1rem', border: '1px solid rgba(0,0,0,.125)' }}>
          <span>Veículos</span>
        </div>
        <div className='bg-[#fff] flex flex-col p-4'>
        <table cellPadding={2} cellSpacing={0}>
          <tbody>
            <tr style={{ lineHeight: '25px' }}>
              <td className='pr-4 text-base text-[#999]'>ID</td>
              <td className='pr4 text-base text-[#000]'>{data.id_veiculo}</td>
            </tr>
            <tr style={{ lineHeight: '25px' }}>
              <td className='pr-4 text-base text-[#999]'>Placa</td>
              <td className='pr4 text-base text-[#000]'>{data.placa}</td>
            </tr>
            <tr>
              <td className='pr-4 text-base text-[#999]'>Estado</td>
              <td className='pr4 text-base text-[#000]'>{data.uf_estado}</td>
            </tr>
            <tr>
              <td className='pr-4 text-base text-[#999]'>Motorizado</td>
              <td className='pr4 text-base text-[#000]'>{data.tipo_parte_veiculo ? "SIM" : "NÃO"}</td>
            </tr>
            <tr>
              <td className='pr-4 text-base text-[#999]'>Renavam</td>
              <td className='pr4 text-base text-[#000]'>{data.renavam}</td>
            </tr>
            <tr>
              <td className='pr-4 text-base text-[#999]'>Ano Exercício CRLV</td>
              <td className='pr4 text-base text-[#000]'>{data.ano_exercicio_crlv}</td>
            </tr>
            <tr>
              <td className='pr-4 text-base text-[#999]'>Livre Acesso ao Pátio	</td>
              <td className='pr4 text-base text-[#000]'>{data.livre_acesso_patio ? "SIM" : "NÃO"}</td>
            </tr>
            <tr>
              <td className='pr-4 text-base text-[#999]'>Ativo</td>
              <td className='pr4 text-base text-[#000]'>{data.ativo ? "SIM" : "NÃO"}</td>
            </tr>
            <tr>
              <td className='pr-4 text-base text-[#999]'>Data de Modificação</td>
              <td className='pr4 text-base text-[#000]'>{data.data_historico}</td>
            </tr>
           
          </tbody>
        </table>
        
        </div>
      </div>
    </div>
  );
}

export default InfoVeiculo;