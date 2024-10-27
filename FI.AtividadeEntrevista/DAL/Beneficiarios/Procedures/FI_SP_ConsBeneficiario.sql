CREATE PROCEDURE [dbo].[Beneficiario_ListarPorCliente]
    @IdCliente BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        ID,
        NOME,
        CPF,
        IDCLIENTE
    FROM 
        BENEFICIARIOS 
    WHERE 
        IDCLIENTE = @IdCliente
END