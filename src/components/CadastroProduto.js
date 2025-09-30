import React, { useState, useEffect } from 'react';
import './CadastroProduto.css';
import { produtoService } from '../services/produtoService';
import { fornecedorService } from '../services/fornecedorService'; // Adicione esta linha

const CadastroProduto = ({ onSubmit, onCancel, produtoEdicao, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    nome: produtoEdicao?.nome || '',
    codigo: produtoEdicao?.codigo || '',
    quantidade: produtoEdicao?.quantidade || '',
    validade: produtoEdicao?.validade || '',
    local: produtoEdicao?.local || '',
    idtipo: produtoEdicao?.idtipo || '',
    idfornecedor: produtoEdicao?.idfornecedor || '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState([]); // Novo estado

  useEffect(() => {
    // Buscar fornecedores cadastrados no banco
    const fetchFornecedores = async () => {
      try {
        const lista = await fornecedorService.listar();
        setFornecedores(lista);
      } catch {
        setFornecedores([]);
      }
    };
    fetchFornecedores();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.quantidade || formData.quantidade < 0) {
      newErrors.quantidade = 'Quantidade é obrigatória e deve ser maior ou igual a zero';
    }

    if (!formData.idtipo) {
      newErrors.idtipo = 'Tipo é obrigatório';
    }

    if (!formData.local.trim()) {
      newErrors.local = 'Localização é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const produtoData = {
        nome: formData.nome,
        codigo: formData.codigo,
        quantidade: parseInt(formData.quantidade),
        validade: formData.validade || null,
        local: formData.local,
        idtipo: parseInt(formData.idtipo),
        idfornecedor: parseInt(formData.idfornecedor),
        entrada: new Date().toISOString().split('T')[0], // data atual YYYY-MM-DD
      };

      await produtoService.cadastrar(produtoData);
      onSubmit?.(produtoData);

      if (!produtoEdicao) {
        setFormData({
          nome: '',
          codigo: '',
          quantidade: '',
          validade: '',
          local: '',
          idtipo: '',
          idfornecedor: '',
        });
      }
    } catch (error) {
      setErrors({ submit: 'Erro ao cadastrar produto. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="cadastro-produto">
      <h2>{mode === 'edit' ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
      
      <form onSubmit={handleSubmit} className="produto-form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="codigo">Código *</label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantidade">Quantidade *</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={formData.quantidade}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="validade">Validade</label>
          <input
            type="date"
            id="validade"
            name="validade"
            value={formData.validade}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="local">Localização *</label>
          <input
            type="text"
            id="local"
            name="local"
            value={formData.local}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="idtipo">Tipo *</label>
          <select
            name="idtipo"
            value={formData.idtipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="1">Perecível</option>
            <option value="2">Não perecível</option>
            <option value="3">Outros</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="idfornecedor">Fornecedor *</label>
          <select
            name="idfornecedor"
            value={formData.idfornecedor}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o fornecedor</option>
            {fornecedores.map(f => (
              <option key={f.idfornecedor} value={f.idfornecedor}>{f.nome}</option>
            ))}
          </select>
        </div>

        {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleCancel}
            className="btn-cancelar"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-salvar"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : (mode === 'edit' ? 'Atualizar' : 'Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroProduto; // ← EXPORT DEFAULT CORRETO