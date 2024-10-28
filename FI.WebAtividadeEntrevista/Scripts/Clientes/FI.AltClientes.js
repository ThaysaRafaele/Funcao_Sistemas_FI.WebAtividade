
$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF).mask('999.999.999-99');
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

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
                }
        });
    })

    $('#modalBeneficiarios').on('show.bs.modal', function () {
        carregarBeneficiarios(obj.Id);
    });

    $('#formBeneficiarios').submit(function (e) {
        e.preventDefault();

        const idBeneficiario = $('#BeneficiarioID').val();
        const dadosBeneficiarioAlterar = {
            "ID": idBeneficiario,
            "CPF": $(this).find("#BeneficiarioCPF").val(),
            "Nome": $(this).find("#BeneficiarioNome").val(),
            "IdCliente": obj.Id
        };

        const dadosBeneficiarioIncluir = {
            "CPF": $(this).find("#BeneficiarioCPF").val(),
            "Nome": $(this).find("#BeneficiarioNome").val(),
            "IdCliente": obj.Id
        };

        const url = idBeneficiario ? urlAlterarBeneficiario : urlIncluirBeneficiario;
        const dado = idBeneficiario ? dadosBeneficiarioAlterar : dadosBeneficiarioIncluir;

        $.ajax({
            url: url,
            method: "POST",
            data: dado,
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                carregarBeneficiarios(obj.Id); 
                $('#formBeneficiarios')[0].reset();
                $('#BeneficiarioID').val(""); 
                $('#btnSalvarBeneficiario').text("Incluir"); 
                ModalDialog("Sucesso!", r);
            }
        });
    });


})

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


$('#modalBeneficiarios').on('show.bs.modal', function () {
    // Verifica se está incluindo ou editando um beneficiário
    const idBeneficiario = $('#BeneficiarioID').val();

    if (idBeneficiario) {
        $('#btnSalvarBeneficiario').text("Alterar");
    } else {
        $('#btnSalvarBeneficiario').text("Incluir");
    }
});



$('#modalBeneficiarios').on('hidden.bs.modal', function () {
    $('#BeneficiarioID').val("");
    $('#BeneficiarioCPF').val("");
    $('#BeneficiarioNome').val("");
    $('#btnSalvarBeneficiario').text("Incluir");
});




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
                carregarBeneficiarios(obj.Id);
                ModalDialog("Sucesso!", r);
            }
        });
    }
}


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
