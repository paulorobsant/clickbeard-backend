# Começando o projeto

Primeiro instale os pacotes:

### `yarn install` ou `npm run install`

Logo em seguida pegue as credenciais e crie o banco de dados.
Assim que criado rode

### `yarn migration` ou `npm run migration`

Para subir as tabelas no banco de dados.
Assim que terminar rode as seeds para gerar o primeiro usuario admin do projeto.

### `node ace db:seed --files "./database/seeders/User.ts"`

Agora está tudo pronto pra começar.

### `yarn dev` ou `npm run dev`
 
# Sobre o projeto

Sistema de agendamento para barbearia - ClickBeard

O dono de uma barbearia te procurou para desenvolver um sistema de agendamento.
Nesse sistema ele deve poder cadastrar todos os barbeiros (nome, idade e data da contratação) e suas respectivas especialidades (sobrancelha, corte de tesoura, barba, etc...).
Um barbeiro pode ter mais de uma especialidade.
A barbearia funciona todos os dias de 8:00h às 18:00h.
O dono (ADM) precisa visualizar de forma fácil os agendamentos do dia atual e os próximos.
Os clientes devem se cadastrar no sistema (nome, email e senha).
Um email deve pertencer somente a um cliente.
Os clientes devem conseguir fazer login no sistema.
Após autenticação, o cliente deve selecionar um horário , especialidade e um barbeiro da especialidade escolhida para concluir o agendamento (Atenção: um barbeiro não pode atender dois clientes no mesmo horário)
Leve em consideração que um atendimento demora exatamente 30 minutos.
O cliente pode cancelar um agendamento até 2 horas antes do horário marcado.
O cliente pode visualizar seus agendamentos.