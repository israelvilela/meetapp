# MeetApp - Backend

# Banco de dados - PostgreSQL

* Para subir o banco de dados com o docker, execute o comando abaixo:

    docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11

# Redis

* Para subir o redis com o docker, execute o comando abaixo:
    
    docker run --name redis -p 6379:6379 -d -t redis:alpine
    
 # Mail
 
 * É necessário ter configurado um servidor de email. Para testes, foi utilizado o Mailtrap.
 
 # MD5 - APP_KEY
 
 * No arquivo .env do projeto, é necessário adicionar uma chave criptografada para o projeto.
 
    
 Para subir o projeto, é necessário configurar o arquivo (.env.example) que se encontra na raiz do projeto com os endereços que estão configurados na sua máquina.
 
 **ATENÇÃO!!
 
 **Após preencher os campos, renomear o arquivo para .env
 
 # Subindo projeto
 
 Para subir o projeto, é necessário executar dois comandos:
 
 * yarn dev
 * yarn queue
