
$(document).ready(function () {

    $('#CPF').mask('999.999.999-99');

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpf = $('#CPF').val().replace(/[^\d]/g, '');
        if (!validaCPF(cpf)) {
            ModalDialog("Erro", "CPF inválido");
            return false;
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
    })

    function validaCPF(cpf) {
        if (cpf.length != 11)
            return false;

        var soma = 0;
        var resto;

        if (cpf == "00000000000") return false;

        for (var i = 1; i <= 9; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (var i = 1; i <= 10; i++)
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);

        resto = (soma * 10) % 11;

        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    // Gerenciando beneficiários
    $('#modalBeneficiarios').on('show.bs.modal', function () {
        carregarBeneficiarios();
    });

    $('#formBeneficiarios').submit(function (e) {
        e.preventDefault();

        var cpf = $('#BeneficiarioCPF').val().replace(/[^\d]/g, '');
        var nome = $('#BeneficiarioNome').val();

        if (!validaCPF(cpf)) {
            ModalDialog("Erro", "CPF do beneficiário é inválido");
            return false;
        }

        $.ajax({
            url: '/Beneficiarios/Incluir',
            method: "POST",
            data: {
                "CPF": cpf,
                "Nome": nome,
                "IdCliente": idCliente
            },
            success: function (response) {
                carregarBeneficiarios();
                $('#formBeneficiarios')[0].reset();
                ModalDialog("Sucesso!", response);
            },
            error: function (r) {
                ModalDialog("Erro", r.responseJSON || "Ocorreu um erro ao incluir o beneficiário.");
            }
        });
    });

    function carregarBeneficiarios() {
        $.ajax({
            url: '/Beneficiarios/Listar/' + idCliente, // Ajustar depois que eu montar controller
            method: "GET",
            success: function (beneficiarios) {
                var tabela = $('#tabelaBeneficiarios');
                tabela.empty();

                beneficiarios.forEach(function (beneficiario) {
                    tabela.append('<tr>' +
                        '<td>' + beneficiario.CPF + '</td>' +
                        '<td>' + beneficiario.Nome + '</td>' +
                        '<td>' +
                        '<button class="btn btn-warning btn-sm" onclick="alterarBeneficiario(' + beneficiario.ID + ')">Alterar</button>' +
                        '<button class="btn btn-danger btn-sm" onclick="excluirBeneficiario(' + beneficiario.ID + ')">Excluir</button>' +
                        '</td>' +
                        '</tr>');
                });
            },
            error: function () {
                ModalDialog("Erro", "Ocorreu um erro ao carregar os beneficiários.");
            }
        });
    }

    function alterarBeneficiario(id) {
        // Ajustar a lógica para alterar o beneficiário aqui
       
    }

    function excluirBeneficiario(id) {
        $.ajax({
            url: '/Beneficiarios/Excluir', //Ajustar depois que eu montar controller
            method: "POST",
            data: { "id": id },
            success: function () {
                carregarBeneficiarios();
                ModalDialog("Sucesso", "Beneficiário excluído com sucesso.");
            },
            error: function () {
                ModalDialog("Erro", "Ocorreu um erro ao excluir o beneficiário.");
            }
        });
    }

})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
