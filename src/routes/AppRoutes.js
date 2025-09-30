import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import HomePage from '../pages/HomePage';
import CadastroProdutoPage from '../pages/CadastroProdutoPage';
import ConsultaEstoquePage from '../pages/ConsultaEstoquePage';
import MovimentacoesPage from '../pages/MovimentacoesPage';
import FornecedoresPage from '../pages/FornecedoresPage';
import { produtoService } from '../services/produtoService';
import { movimentacaoService } from '../services/movimentacaoService';

const AppRoutes = () => {
  const navigate = useNavigate();

  // Handlers para Produtos
  const handleAddProduto = async (produtoData) => {
    try {
      await produtoService.cadastrar(produtoData);
      alert('Produto cadastrado com sucesso!');
      navigate('/consulta-estoque');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto. Tente novamente.');
    }
  };

  const handleEditProduto = async (id, produtoData) => {
    try {
      await produtoService.atualizar(id, produtoData);
      alert('Produto atualizado com sucesso!');
      navigate('/consulta-estoque');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    }
  };

  // Handlers para Movimentações
  const handleAddMovimentacao = async (movimentacaoData) => {
    try {
      await movimentacaoService.registrar(movimentacaoData);
      alert('Movimentação registrada com sucesso!');
      navigate('/movimentacoes');
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      alert('Erro ao registrar movimentação. Tente novamente.');
    }
  };

  const handleEditMovimentacao = async (id, movimentacaoData) => {
    try {
      await movimentacaoService.atualizar(id, movimentacaoData);
      alert('Movimentação atualizada com sucesso!');
      navigate('/movimentacoes');
    } catch (error) {
      console.error('Erro ao atualizar movimentação:', error);
      alert('Erro ao atualizar movimentação. Tente novamente.');
    }
  };

  // Componente NotFoundPage interno
  const NotFoundPage = () => (
    <div className="not-found">
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <button onClick={() => navigate('/')}>Voltar para Home</button>
    </div>
  );

  return (
    <Layout>
      <Routes>
        {/* Página Inicial */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rotas de Produtos */}
        <Route 
          path="/cadastro-produto" 
          element={
            <CadastroProdutoPage 
              onSubmit={handleAddProduto}
              mode="create"
            />
          } 
        />
        
        <Route 
          path="/editar-produto/:id" 
          element={
            <CadastroProdutoPage 
              onSubmit={handleEditProduto}
              mode="edit"
            />
          } 
        />
        
        <Route path="/consulta-estoque" element={<ConsultaEstoquePage />} />
        
        {/* Rotas de Movimentações */}
        <Route 
          path="/movimentacoes/nova" 
          element={
            <MovimentacoesPage 
              onSubmit={handleAddMovimentacao}
              mode="create"
            />
          } 
        />
        
        <Route 
          path="/movimentacoes/editar/:id" 
          element={
            <MovimentacoesPage 
              onSubmit={handleEditMovimentacao}
              mode="edit"
            />
          } 
        />
        
        <Route path="/movimentacoes" element={<MovimentacoesPage />} />
        
        {/* Outras Rotas */}
        <Route path="/fornecedores" element={<FornecedoresPage />} />
        
        {/* Rota 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;