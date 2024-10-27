CREATE PROCEDURE Beneficiario_Alterar
    @ID INT,
    @CPF VARCHAR(14),
    @Nome VARCHAR(255)
AS
BEGIN
    UPDATE BENEFICIARIOS
    SET CPF = @CPF,
        NOME = @Nome
    WHERE ID = @ID;
END;
