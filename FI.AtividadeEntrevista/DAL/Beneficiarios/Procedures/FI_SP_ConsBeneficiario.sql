CREATE PROCEDURE Beneficiario_Consultar
    @ID BIGINT
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
        ID = @ID
END