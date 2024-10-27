using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace FI.AtividadeEntrevista.DAL
{
    /// <summary>
    /// Classe de acesso a dados de Beneficiário
    /// </summary>
    internal class DaoBeneficiario : AcessoDados
    {
        /// <summary>
        /// Inclui um novo beneficiário
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiário</param>
        internal long Incluir(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF),
                new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome),
                new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente)
            };

            DataSet ds = base.Consultar("Beneficiario_Incluir", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        /// <summary>
        /// Consulta beneficiário por ID
        /// </summary>
        /// <param name="id">ID do beneficiário</param>
        internal DML.Beneficiario Consultar(long id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Id", id)
            };

            DataSet ds = base.Consultar("Beneficiario_Consultar", parametros);
            List<DML.Beneficiario> beneficiarios = Converter(ds);

            return beneficiarios.FirstOrDefault();
        }

        /// <summary>
        /// Lista beneficiários de um cliente
        /// </summary>
        /// <param name="idCliente">ID do cliente</param>
        internal List<DML.Beneficiario> ListarPorCliente(long idCliente)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("IdCliente", idCliente)
            };

            DataSet ds = base.Consultar("Beneficiario_ListarPorCliente", parametros);
            return Converter(ds);
        }

        /// <summary>
        /// Altera os dados de um beneficiário
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiário</param>
        internal void Alterar(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Id", beneficiario.Id),
                new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF),
                new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome)
            };

            base.Executar("Beneficiario_Alterar", parametros);
        }

        /// <summary>
        /// Exclui um beneficiário
        /// </summary>
        /// <param name="id">ID do beneficiário</param>
        internal void Excluir(long id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>
            {
                new System.Data.SqlClient.SqlParameter("Id", id)
            };

            base.Executar("Beneficiario_Excluir", parametros);
        }

        /// <summary>
        /// Converte um DataSet para uma lista de objetos Beneficiario
        /// </summary>
        /// <param name="ds">DataSet</param>
        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario beneficiario = new DML.Beneficiario
                    {
                        Id = row.Field<long>("ID"),
                        CPF = row.Field<string>("CPF"),
                        Nome = row.Field<string>("NOME"),
                        IdCliente = row.Field<long>("IDCLIENTE")
                    };
                    lista.Add(beneficiario);
                }
            }

            return lista;
        }
    }
}
