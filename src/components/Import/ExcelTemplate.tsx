import React from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

export const ExcelTemplate: React.FC = () => {
  const downloadTemplate = () => {
    // Dados de exemplo para o template
    const templateData = [
      // Cabeçalhos
      [
        'linhaCotacoes',
        'referencia',
        'fabrica',
        'itemNo',
        'description',
        'name',
        'remark',
        'obs',
        'moq',
        'unitCtn',
        'unitPriceRmb',
        'unit',
        'l',
        'w',
        'h',
        'cbm',
        'gw',
        'nw',
        'pesoUnitario',
        'marca',
        'codRavi',
        'ean',
        'dun',
        'nomeInvoiceEn',
        'nomeDiNb',
        'nomeRaviProfit',
        'qtMinVenda',
        'ncm',
        'cest',
        'valorInvoiceUsd',
        'obsPedido'
      ],
      // Exemplo 1
      [
        'Linha A',
        'A11',
        'Settup',
        'ST001',
        'BRAÇO FIXO / FIXED ARM',
        'BRAÇO FIXO / FIXED ARM - A11',
        'Produto de alta qualidade',
        'Braço fixo para monitores',
        10,
        1,
        12.00,
        'pcs',
        30.0,
        5.0,
        5.0,
        0.00075,
        0.5,
        0.4,
        0.4,
        'Settup',
        'RAVI001',
        '1234567890123',
        'DUN001',
        'Fixed Monitor Arm A11',
        'Braço Fixo A11',
        'Braço Fixo A11',
        1,
        '84716000',
        'CEST001',
        1.50,
        'Produto frágil, manuseio cuidadoso'
      ],
      // Exemplo 2
      [
        'Linha A',
        'A20',
        'Settup',
        'ST002',
        'BRAÇO ARTICULADO / ARTICULATED ARM',
        'BRAÇO ARTICULADO / ARTICULATED ARM - A20',
        'Braço com articulação completa',
        'Braço articulado para monitores',
        5,
        1,
        25.00,
        'pcs',
        40.0,
        6.0,
        6.0,
        0.00144,
        0.8,
        0.7,
        0.7,
        'Settup',
        'RAVI002',
        '1234567890124',
        'DUN002',
        'Articulated Monitor Arm A20',
        'Braço Articulado A20',
        'Braço Articulado A20',
        1,
        '84716000',
        'CEST002',
        3.00,
        'Produto com articulação, verificar funcionamento'
      ],
      // Exemplo 3
      [
        'Linha A',
        'A40',
        'Settup',
        'ST003',
        'BRAÇO BI-ARTICULADO / BI-ARTICULATED ARM',
        'BRAÇO BI-ARTICULADO / BI-ARTICULATED ARM - A40',
        'Braço com dupla articulação',
        'Braço bi-articulado para monitores',
        3,
        1,
        45.00,
        'pcs',
        50.0,
        7.0,
        7.0,
        0.00245,
        1.2,
        1.0,
        1.0,
        'Settup',
        'RAVI003',
        '1234567890125',
        'DUN003',
        'Bi-Articulated Monitor Arm A40',
        'Braço Bi-Articulado A40',
        'Braço Bi-Articulado A40',
        1,
        '84716000',
        'CEST003',
        5.50,
        'Produto premium, embalagem especial'
      ]
    ];

    // Criar workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // Ajustar largura das colunas
    const colWidths = [
      { wch: 15 }, // linhaCotacoes
      { wch: 10 }, // referencia
      { wch: 15 }, // fabrica
      { wch: 10 }, // itemNo
      { wch: 30 }, // description
      { wch: 35 }, // name
      { wch: 20 }, // remark
      { wch: 25 }, // obs
      { wch: 8 },  // moq
      { wch: 10 }, // unitCtn
      { wch: 12 }, // unitPriceRmb
      { wch: 8 },  // unit
      { wch: 8 },  // l
      { wch: 8 },  // w
      { wch: 8 },  // h
      { wch: 10 }, // cbm
      { wch: 8 },  // gw
      { wch: 8 },  // nw
      { wch: 12 }, // pesoUnitario
      { wch: 12 }, // marca
      { wch: 12 }, // codRavi
      { wch: 15 }, // ean
      { wch: 10 }, // dun
      { wch: 25 }, // nomeInvoiceEn
      { wch: 20 }, // nomeDiNb
      { wch: 20 }, // nomeRaviProfit
      { wch: 12 }, // qtMinVenda
      { wch: 12 }, // ncm
      { wch: 12 }, // cest
      { wch: 12 }, // valorInvoiceUsd
      { wch: 30 }  // obsPedido
    ];
    worksheet['!cols'] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');

    // Fazer download
    XLSX.writeFile(workbook, 'template-produtos.xlsx');
  };

  return (
    <button
      onClick={downloadTemplate}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        backgroundColor: '#9333ea',
        color: 'white',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '0.5rem'
      }}
    >
      <Download style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
      Baixar Template
    </button>
  );
};
