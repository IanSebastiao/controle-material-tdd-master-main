import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CadastroProduto from '../components/CadastroProduto';
import { produtoService } from '../services/produtoService';

// Mock do serviço
jest.mock('../services/produtoService');

describe('Componente CadastroProduto', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar o formulário com campos obrigatórios', () => {
    render(<CadastroProduto onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/localizaçã/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  test('deve validar campos obrigatórios', async () => {
    render(<CadastroProduto onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const salvarButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(salvarButton);

    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/quantidade é obrigatória/i)).toBeInTheDocument();
    });
  });

  test('deve submeter o formulário com dados válidos', async () => {
    const mockProdutoData = {
      name: 'Produto Teste',
      quantidade: 10,
      tipo: 'Eletrônico',
      localizacao: 'Almoxarifado A',
      descricao: '',
      validado: expect.any(String)
    };

    produtoService.cadastrar.mockResolvedValue({ success: true });

    render(<CadastroProduto onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    await userEvent.type(screen.getByLabelText(/nome/i), mockProdutoData.name);
    await userEvent.type(screen.getByLabelText(/quantidade/i), String(mockProdutoData.quantidade));
    await userEvent.selectOptions(screen.getByLabelText(/tipo/i), mockProdutoData.tipo);
    await userEvent.type(screen.getByLabelText(/localizaçã/i), mockProdutoData.localizacao);

    const salvarButton = screen.getByRole('button', { name: /salvar/i });
    await userEvent.click(salvarButton);

    await waitFor(() => {
      expect(produtoService.cadastrar).toHaveBeenCalledWith(expect.objectContaining(mockProdutoData));
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('deve chamar onCancel ao clicar em cancelar', async () => {
    render(<CadastroProduto onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelarButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});