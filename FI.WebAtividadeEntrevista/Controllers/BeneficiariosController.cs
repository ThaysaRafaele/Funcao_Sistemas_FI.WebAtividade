using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiariosController : Controller
    {
        /// <summary>
        /// Página inicial para gerenciamento de beneficiários
        /// </summary>
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                // Verifica se o beneficiário já existe para esse cliente
                if (bo.VerificarExistencia(model.CPF, (int)model.IdCliente))
                {
                    Response.StatusCode = 400;
                    return Json("Beneficiário com o mesmo CPF já existe para este cliente.");
                }

                model.ID = bo.Incluir(new Beneficiario()
                {
                    CPF = model.CPF,
                    Nome = model.Nome,
                    IdCliente = model.IdCliente
                });

                return Json("Beneficiário cadastrado com sucesso");
            }
        }


        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Beneficiario()
                {
                    Id = model.ID,
                    CPF = model.CPF,
                    Nome = model.Nome,
                    IdCliente = model.IdCliente
                });

                return Json("Beneficiário alterado com sucesso");
            }
        }
                
        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            Beneficiario beneficiario = bo.Consultar(id);
            BeneficiarioModel model = null;

            if (beneficiario != null)
            {
                model = new BeneficiarioModel()
                {
                    ID = beneficiario.Id,
                    CPF = beneficiario.CPF,
                    Nome = beneficiario.Nome,
                    IdCliente = beneficiario.IdCliente
                };
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult Excluir(long id)
        {
            try
            {
                BoBeneficiario bo = new BoBeneficiario();
                bo.Excluir(id);

                return Json("Beneficiário excluído com sucesso");
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json($"Erro ao excluir beneficiário: {ex.Message}");
            }
        }

        [HttpGet]
        public JsonResult ListarPorCliente(long? idCliente)
        {
            try
            {
                BoBeneficiario bo = new BoBeneficiario();
                List<Beneficiario> beneficiarios = bo.ListarPorCliente(idCliente.Value);


                if (beneficiarios == null)
                {
                    return Json(new { Result = "ERROR", Message = "Nenhum beneficiário encontrado" }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Result = "OK", Records = beneficiarios }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {               
                System.Diagnostics.Debug.WriteLine($"Erro completo: {ex.ToString()}");
                return Json($"Erro ao carregar lista de beneficiários: {ex.Message}");
            }
        }

    }
}
