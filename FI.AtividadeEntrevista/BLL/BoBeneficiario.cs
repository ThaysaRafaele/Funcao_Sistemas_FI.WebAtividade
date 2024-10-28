using FI.AtividadeEntrevista.DAL;
using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        /// <summary>
        /// Inclui um novo beneficiário
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiário</param>
        public long Incluir(Beneficiario beneficiario)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            return dao.Incluir(beneficiario);
        }

        /// <summary>
        /// Altera um beneficiário
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiário</param>
        public void Alterar(Beneficiario beneficiario)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            dao.Alterar(beneficiario);
        }

        /// <summary>
        /// Consulta o beneficiário pelo ID
        /// </summary>
        /// <param name="id">ID do beneficiário</param>
        public Beneficiario Consultar(long id)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            return dao.Consultar(id);
        }

        /// <summary>
        /// Exclui o beneficiário pelo ID
        /// </summary>
        /// <param name="id">ID do beneficiário</param>
        public void Excluir(long id)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            dao.Excluir(id);
        }

        /// <summary>
        /// Lista os beneficiários de um cliente
        /// </summary>
        /// <param name="idCliente">ID do cliente</param>
        public List<Beneficiario> ListarPorCliente(long idCliente)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            return dao.ListarPorCliente(idCliente);
        }

        /// <summary>
        /// Verifica a existência de um beneficiário por CPF para um cliente
        /// </summary>
        /// <param name="cpf">CPF do beneficiário</param>
        /// <param name="idCliente">ID do cliente</param>
        public bool VerificarExistencia(string cpf, int idCliente)
        {
            DaoBeneficiario dao = new DaoBeneficiario();
            List<Beneficiario> beneficiarios = dao.ListarPorCliente(idCliente);
            return beneficiarios.Any(b => b.CPF == cpf);
        }

        public void ExcluirPorCliente(long id)
        {
            DaoCliente dao = new DaoCliente();
            dao.Excluir(id);
        }

    }
}
