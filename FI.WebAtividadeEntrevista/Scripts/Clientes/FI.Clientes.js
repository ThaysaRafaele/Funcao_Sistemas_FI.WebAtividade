
var IdCliente;
$(document).ready(function () {

    $('#CPF').mask('999.999.999-99');


    $('#formBeneficiarios').find("input, button").prop("disabled", true);

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
            success: function (response) {

                if (response.ClienteId) {
                    IdCliente = response.ClienteId;
                    ModalDialog("Sucesso!", response.Mensagem);
                    $('#formBeneficiarios').find("input, button").prop("disabled", false);
                } else {
                    ModalDialog("Erro", "Não foi possível obter o ID do cliente.");
                }
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
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

    
    $('#formBeneficiarios').submit(function (e) {
        e.preventDefault();

        var cpf = $('#BeneficiarioCPF').val().replace(/[^\d]/g, '');
        var nome = $('#BeneficiarioNome').val();

        if (!validaCPF(cpf)) {
            ModalDialog("Erro", "CPF do beneficiário é inválido");
            return false;
        }

        const idBeneficiario = $('#BeneficiarioID').val();
        const dadosBeneficiarioAlterar = {
            "ID": idBeneficiario,
            "CPF": $(this).find("#BeneficiarioCPF").val(),
            "Nome": $(this).find("#BeneficiarioNome").val(),
            "IdCliente": IdCliente
        };

        const dadosBeneficiarioIncluir = {
            "CPF": $(this).find("#BeneficiarioCPF").val(),
            "Nome": $(this).find("#BeneficiarioNome").val(),
            "IdCliente": IdCliente
        };

        const url = idBeneficiario ? urlAlterarBeneficiario : urlIncluirBeneficiario;
        const dado = idBeneficiario ? dadosBeneficiarioAlterar : dadosBeneficiarioIncluir;

        $.ajax({
            url: url,
            method: "POST",
            data: dado,
            success: function (response) {
                carregarBeneficiarios(IdCliente);
                $('#formBeneficiarios')[0].reset();
                $('#BeneficiarioID').val("");
                $('#btnSalvarBeneficiario').text("Incluir");
                ModalDialog("Sucesso!", response);
            },
            error: function (r) {
                ModalDialog("Erro", r.responseJSON || "Ocorreu um erro ao incluir o beneficiário.");
            }
        });
    });

    

})

function carregarBeneficiarios(idCliente) {
    $.ajax({
        url: urlListarBeneficiario,
        method: 'GET',
        data: { idCliente: idCliente },
        dataType: 'json',
        success: function (data) {
            if (data.Result === "OK") {
                preencherTabelaBeneficiarios(data.Records);
            } else {
                alert('Erro ao carregar beneficiários: ' + data.Message);
            }
        },
        error: function (xhr, status, error) {
            alert('Erro ao carregar beneficiários: ' + error);
        }
    });
}

function preencherTabelaBeneficiarios(beneficiarios) {
    var tbody = $('#tabelaBeneficiarios');
    tbody.empty();

    beneficiarios.forEach(function (beneficiario) {
        var tr = $('<tr>');
        tr.append($('<td>').text(beneficiario.CPF));
        tr.append($('<td>').text(beneficiario.Nome));
        tr.append($('<td>').html(
            '<button class="btn btn-sm btn-danger" onclick="excluirBeneficiario(' + beneficiario.Id + ')">Excluir</button> ' +
            '<button class="btn btn-sm btn-primary" onclick="editarBeneficiario(' + beneficiario.Id + ')">Alterar</button>'
        ));
        tbody.append(tr);
    });
}

function editarBeneficiario(id) {
    $.ajax({
        url: urlAlterarBeneficiario,
        method: "GET",
        data: { id: id },
        dataType: "json",
        success: function (data) {
            if (data) {
                $('#BeneficiarioID').val(data.ID);
                $('#BeneficiarioCPF').val(data.CPF);
                $('#BeneficiarioNome').val(data.Nome);

                $('#btnSalvarBeneficiario').text("Alterar");
                $('#formBeneficiarios').data("action-url", urlAlterarBeneficiario);

                $('#modalBeneficiarios').modal('show');
            } else {
                ModalDialog("Erro", "Beneficiário não encontrado.");
            }
        },
        error: function (xhr, status, error) {
            ModalDialog("Erro", "Ocorreu um erro ao carregar os dados do beneficiário: " + error);
        }
    });
}

function excluirBeneficiario(id) {
    if (confirm("Deseja realmente excluir este beneficiário?")) {
        $.ajax({
            url: urlExcluirBeneficiario,
            method: "POST",
            data: { id: id },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                carregarBeneficiarios(IdCliente);
                ModalDialog("Sucesso!", r);
            }
        });
    }
}

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
