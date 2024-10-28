
$(document).ready(function () {

    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable({
            title: 'Clientes',
            paging: true, //Enable paging
            pageSize: 5, //Set page size (default: 10)
            sorting: true, //Enable sorting
            defaultSorting: 'Nome ASC', //Set default sorting
            actions: {
                listAction: urlClienteList,
            },
            fields: {
                Nome: {
                    title: 'Nome',
                    width: '50%'
                },
                Email: {
                    title: 'Email',
                    width: '35%'
                },
                Ações: {  
                    title: 'Ações', 
                    width: '15%',
                    display: function (data) {
                        return `
                            <button onclick="window.location.href='${urlAlteracao}/${data.record.Id}'" class="btn btn-primary btn-sm">Alterar</button>
                            <button onclick="excluirCliente(${data.record.Id}, '${data.record.Nome}')" class="btn btn-danger btn-sm">Excluir</button>
                        `;
                    }
                }
            }
        });

    //Load student list from server
    if (document.getElementById("gridClientes"))
        $('#gridClientes').jtable('load');
})

function excluirCliente(id, nome) {
    if (confirm("Tem certeza que deseja excluir o cliente " + nome +"?")) {
        $.ajax({
            url: urlExclusao,
            type: 'POST',
            data: { id: id },
            success: function (response) {
                alert(response);
                $('#gridClientes').jtable('load');
            },
            error: function (r) {
                alert("Ocorreu um erro ao excluir o cliente: " + r.responseText);
            }
        });
    }
}

