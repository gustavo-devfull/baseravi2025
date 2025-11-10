import ExcelJS from 'exceljs';
import type { Product } from '../types/Product';

export class ExcelExportService {
  /**
   * Exporta produtos para Excel com formatação similar ao sistema de referência
   */
  static async exportProductsToExcel(products: Product[]): Promise<void> {
    try {
      // Criar workbook e worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Produtos');

      // Definir colunas
      worksheet.columns = [
        { header: 'IMAGEM', key: 'image', width: 15 },
        { header: 'REFERÊNCIA', key: 'referencia', width: 15 },
        { header: 'NOME RAVI PROFIT', key: 'nomeRaviProfit', width: 30 },
        { header: 'NOME', key: 'name', width: 30 },
        { header: 'FABRICA', key: 'fabrica', width: 20 },
        { header: 'MARCA', key: 'marca', width: 20 },
        { header: 'ITEM NO', key: 'itemNo', width: 15 },
        { header: 'DESCRIÇÃO', key: 'description', width: 40 },
        { header: 'PREÇO UNITÁRIO RMB', key: 'unitPriceRmb', width: 18 },
        { header: 'VALOR INVOICE USD', key: 'valorInvoiceUsd', width: 18 },
        { header: 'MOQ', key: 'moq', width: 10 },
        { header: 'UNIDADES POR CTN', key: 'unitCtn', width: 18 },
        { header: 'QT MIN VENDA', key: 'qtMinVenda', width: 15 },
        { header: 'UNIDADE', key: 'unit', width: 12 },
        { header: 'DIMENSÕES (L×W×H)', key: 'dimensoes', width: 20 },
        { header: 'CBM', key: 'cbm', width: 12 },
        { header: 'PESO BRUTO', key: 'gw', width: 15 },
        { header: 'PESO LÍQUIDO', key: 'nw', width: 15 },
        { header: 'PESO UNITÁRIO', key: 'pesoUnitario', width: 15 },
        { header: 'CÓDIGO RAVI', key: 'codRavi', width: 15 },
        { header: 'NCM', key: 'ncm', width: 12 },
        { header: 'CEST', key: 'cest', width: 12 },
        { header: 'EAN', key: 'ean', width: 15 },
        { header: 'DUN', key: 'dun', width: 15 },
        { header: 'NOME INVOICE EN', key: 'nomeInvoiceEn', width: 30 },
        { header: 'NOME DI NB', key: 'nomeDiNb', width: 30 },
        { header: 'LINHA COTAÇÕES', key: 'linhaCotacoes', width: 20 },
        { header: 'REMARK', key: 'remark', width: 30 },
        { header: 'OBS', key: 'obs', width: 30 },
        { header: 'OBS PEDIDO', key: 'obsPedido', width: 30 },
        { header: 'ATIVO', key: 'active', width: 10 },
      ];

      // Estilizar cabeçalho
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0175A6' }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      headerRow.height = 30;

      // Adicionar dados
      const imagePromises: Promise<void>[] = [];
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const row = worksheet.addRow({
          referencia: product.referencia || '',
          nomeRaviProfit: product.nomeRaviProfit || '',
          name: product.name || '',
          fabrica: product.fabrica || '',
          marca: product.marca || '',
          itemNo: product.itemNo || '',
          description: product.description || '',
          unitPriceRmb: product.unitPriceRmb || 0,
          valorInvoiceUsd: product.valorInvoiceUsd || 0,
          moq: product.moq || 0,
          unitCtn: product.unitCtn || 0,
          qtMinVenda: product.qtMinVenda || 0,
          unit: product.unit || '',
          dimensoes: product.l && product.w && product.h 
            ? `${product.l}×${product.w}×${product.h}` 
            : '',
          cbm: product.cbm || 0,
          gw: product.gw || 0,
          nw: product.nw || 0,
          pesoUnitario: product.pesoUnitario || 0,
          codRavi: product.codRavi || '',
          ncm: product.ncm || '',
          cest: product.cest || '',
          ean: product.ean || '',
          dun: product.dun || '',
          nomeInvoiceEn: product.nomeInvoiceEn || '',
          nomeDiNb: product.nomeDiNb || '',
          linhaCotacoes: product.linhaCotacoes || '',
          remark: product.remark || '',
          obs: product.obs || '',
          obsPedido: product.obsPedido || '',
          active: product.active !== false ? 'Sim' : 'Não',
        });

        // Estilizar linhas alternadas
        if (i % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' }
          };
        }

        // Alinhamento
        row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        row.height = 60; // Aumentar altura para acomodar imagem

        // Adicionar imagem se disponível
        if (product.referencia) {
          const imageUrl = `https://nyc3.digitaloceanspaces.com/moribr/base-fotos/${product.referencia}.jpg`;
          const imagePromise = this.addImageToRow(workbook, worksheet, imageUrl, i + 1).catch((error) => {
            console.warn(`Erro ao adicionar imagem para ${product.referencia}:`, error);
          });
          imagePromises.push(imagePromise);
        }
      }

      // Aguardar todas as imagens serem processadas
      await Promise.allSettled(imagePromises);

      // Aplicar bordas em todas as células
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          };
        });
      });

      // Congelar primeira linha
      worksheet.views = [
        { state: 'frozen', ySplit: 1 }
      ];

      // Gerar arquivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `produtos_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      throw new Error('Falha ao exportar planilha');
    }
  }

  /**
   * Adiciona imagem a uma linha específica da planilha
   */
  private static async addImageToRow(
    workbook: ExcelJS.Workbook,
    worksheet: ExcelJS.Worksheet,
    imageUrl: string,
    rowNumber: number
  ): Promise<void> {
    try {
      const base64 = await this.getImageAsBase64(imageUrl);
      const imageId = workbook.addImage({
        base64: base64,
        extension: 'jpeg',
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: rowNumber },
        ext: { width: 100, height: 100 }
      });
    } catch (error) {
      // Silenciosamente falhar se a imagem não puder ser carregada
      throw error;
    }
  }

  /**
   * Converte URL de imagem para base64
   */
  private static async getImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl, {
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remover o prefixo data:image/...;base64,
          const base64 = base64String.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      throw error;
    }
  }
}

