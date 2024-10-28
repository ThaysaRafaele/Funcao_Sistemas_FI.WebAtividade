# Projeto de Cadastro de Clientes

Este projeto é uma aplicação para o gerenciamento de clientes e beneficiários. <br/>
A aplicação utiliza ASP.NET e SQL Server.

## Funcionalidades

- Inclusão de novos clientes e beneficiários
- Alteração de dados de clientes e beneficiários existentes
- Consulta de clientes e beneficiários
- Exclusão de clientes e beneficiários
- Verificação de duplicidade de CPF

## Requisitos

- [.NET Framework 4.8](https://dotnet.microsoft.com/download/dotnet-framework)
- [SQL Server Express 2019 LocalDB](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

## Instalação

1. Clone este repositório:
   ```bash
   git clone (https://github.com/ThaysaRafaele/Funcao_Sistemas_FI.WebAtividade.git)
   cd nome_do_repositorio

2. Abra o projeto no Visual Studio > Instale os pacotes NuGet necessários (Abra o Package Manager Console no Visual Studio e execute o seguinte comando: Update-Package).

3. Comandos SQL Necessários:
Antes de rodar a aplicação, você precisa executar os seguintes comandos SQL no SQL Server:
* OBS.: Você pode abrir o Gerenciador de Servidores no Visual Studio com duplo clique no arquivo: FI.WebAtividadeEntrevista\App_Data\BancoDeDados.mdf
Exemplos de Comandos SQL
Aqui estão alguns exemplos de comandos SQL usados no projeto. Clique no título para expandir e ver o código completo.

<details> 
  <summary>Clique para expandir os comandos nSQL</summary>
   
    CREATE TABLE Clientes (
      Id BIGINT PRIMARY KEY IDENTITY(1,1),
      Nome NVARCHAR(100) NOT NULL,
      Sobrenome NVARCHAR(100) NOT NULL,
      Nacionalidade NVARCHAR(100),
      CEP NVARCHAR(10),
      Estado NVARCHAR(50),
      Cidade NVARCHAR(50),
      Logradouro NVARCHAR(200),
      Email NVARCHAR(100),
      Telefone NVARCHAR(20),
      CPF NVARCHAR(11) UNIQUE NOT NULL
    );

    CREATE PROCEDURE FI_SP_IncClienteV2
      @Nome NVARCHAR(100),
      @Sobrenome NVARCHAR(100),
      @Nacionalidade NVARCHAR(100),
      @CEP NVARCHAR(10),
      @Estado NVARCHAR(50),
      @Cidade NVARCHAR(50),
      @Logradouro NVARCHAR(200),
      @Email NVARCHAR(100),
      @Telefone NVARCHAR(20),
      @CPF NVARCHAR(11)
    AS    
    BEGIN
      INSERT INTO Clientes (Nome, Sobrenome, Nacionalidade, CEP, Estado, Cidade, Logradouro, Email, Telefone, CPF)
      VALUES (@Nome, @Sobrenome, @Nacionalidade, @CEP, @Estado, @Cidade, @Logradouro, @Email, @Telefone, @CPF);
      SELECT SCOPE_IDENTITY();
    END;
    
    CREATE PROCEDURE FI_SP_ConsCliente
      @Id BIGINT
      AS
      BEGIN
        SELECT * FROM Clientes WHERE Id = @Id;
    END;
    
    CREATE PROCEDURE FI_SP_VerificaCliente
      @CPF NVARCHAR(11)
      AS
      BEGIN
        SELECT * FROM Clientes WHERE CPF = @CPF;
    END;
    
    CREATE PROCEDURE FI_SP_AltCliente
      @Id BIGINT,
      @Nome NVARCHAR(100),
      @Sobrenome NVARCHAR(100),
      @Nacionalidade NVARCHAR(100),
      @CEP NVARCHAR(10),
      @Estado NVARCHAR(50),
      @Cidade NVARCHAR(50),
      @Logradouro NVARCHAR(200),
      @Email NVARCHAR(100),
      @Telefone NVARCHAR(20),
      @CPF NVARCHAR(11)
    AS
    BEGIN
      UPDATE Clientes
      SET Nome = @Nome,
          Sobrenome = @Sobrenome,
          Nacionalidade = @Nacionalidade,
          CEP = @CEP,
          Estado = @Estado,
          Cidade = @Cidade,
          Logradouro = @Logradouro,
          Email = @Email,
          Telefone = @Telefone,
          CPF = @CPF
      WHERE Id = @Id;
    END;
    
    CREATE PROCEDURE FI_SP_DelCliente
      @Id BIGINT
    AS
    BEGIN
      DELETE FROM Clientes WHERE Id = @Id;
    END;
</details>


### Tela Listar Clientes
![image](https://github.com/user-attachments/assets/ac59ed3e-536e-4cf8-8d00-66af18d67114)

### Tela Cadasrar Clientes
![image](https://github.com/user-attachments/assets/f13a23d9-003a-458f-b4df-3295017732af)

### Tela Alterar Clientes
![image](https://github.com/user-attachments/assets/828c9640-a03c-4507-9fc1-92d5ea9dfcc2)

### Tela Excluir Clientes
![image](https://github.com/user-attachments/assets/0c4c7843-e8fe-4a13-862b-cde83b1dff72)
![image](https://github.com/user-attachments/assets/504552c6-0be5-4b6a-b4e1-1a7a3a2e0b0e)

### Tela Beneficiários
![image](https://github.com/user-attachments/assets/900f8dfc-5133-4065-a51d-a355cb6b190a)

