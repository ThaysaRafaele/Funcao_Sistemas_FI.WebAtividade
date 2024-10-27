using System.ComponentModel.DataAnnotations;

public class BeneficiarioModel
{
    public long ID { get; set; }

    [Required(ErrorMessage = "CPF é obrigatório")]
    [StringLength(14, ErrorMessage = "CPF deve ter 14 caracteres")]
    [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "CPF inválido")]
    public string CPF { get; set; }
    public string Nome { get; set; }
    public long IdCliente { get; set; }
}
