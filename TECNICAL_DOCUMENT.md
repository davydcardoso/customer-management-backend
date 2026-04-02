# Documento Tecnico

## 1. Objetivo

Construir um backend do zero para um CRUD de clientes com suporte a:

- Cadastro de cliente pessoa fisica
- Cadastro de cliente pessoa juridica
- Cadastro de responsaveis vinculados ao cliente
- Login basico sem cadastro publico de usuarios
- Estrutura preparada para formularios futuros com padronizacao de metadados de campos

Stack definida:

- Node.js
- Express
- TypeORM
- PostgreSQL

Diretriz principal:

- Arquitetura limpa
- Separacao clara de responsabilidades
- Sem classes ou services monoliticos
- DTOs organizados por contexto e secao do formulario

## 2. Escopo funcional

O sistema tera inicialmente os seguintes modulos:

1. Autenticacao
2. Clientes
3. Responsaveis
4. Metadados de formulario
5. Dados de referencia simples

## 3. Regras de negocio alinhadas

### 3.1 Cadastro unico para PF e PJ

Havera um unico cadastro de cliente com discriminador por tipo de pessoa:

- `INDIVIDUAL`
- `COMPANY`

O frontend decidira quais campos exibir conforme o tipo, mas o backend mantera o mesmo fluxo de cadastro.

### 3.2 Responsavel

- Responsavel sera exigido apenas para cliente `COMPANY`
- Cliente `INDIVIDUAL` nao exige responsavel
- Cliente `COMPANY` pode possuir um ou varios responsaveis
- Responsavel sera tratado como entidade filha do cliente

### 3.3 Campo "Quem e o amigo?"

- O campo sera armazenado como `string`
- O valor persistido sera o nome informado/selecionado
- O sistema tera uma rota de busca de clientes por nome, CPF ou CNPJ
- O frontend podera usar essa rota para localizar um cliente e preencher o nome no campo

### 3.4 Cidade e estado

- Cidade e estado serao texto livre no backend
- O frontend podera usar mocks proprios para listas predefinidas
- Nao havera dependencia inicial de tabelas oficiais de cidade/estado

### 3.5 Lucratividade

Os campos abaixo sao calculados:

- `profitabilityAmount`
- `profitabilityPercentage`

Esses valores nao devem ser tratados como entrada primaria do usuario sem regra de negocio. O backend deve calcular com base nos valores financeiros informados.

Formula inicial sugerida:

- `profitabilityAmount = consumedAmount - costAmount`
- `profitabilityPercentage = profitabilityAmount / consumedAmount * 100`

Regras:

- Se `consumedAmount` for zero, `profitabilityPercentage` deve ser zero
- O sistema deve recalcular esses valores em criacao e atualizacao

### 3.6 Campos com botao "+"

Os botoes `+` indicam colecoes dinamicas de dados, principalmente:

- Contatos
- E-mails

Decisao tecnica:

- Armazenar em tabelas filhas relacionais
- Nao usar array JSON para esse caso

Justificativa:

- Facilita validacao individual por item
- Facilita filtros futuros
- Facilita evolucao do modelo
- Mantem integridade relacional

## 4. Interpretacao dos formularios

As imagens mostram tres contextos principais:

1. Dados cadastrais de pessoa fisica
2. Dados cadastrais de pessoa juridica
3. Dados do responsavel

Existe alta sobreposicao de campos entre PF, PJ e responsavel. Por isso, o modelo deve separar:

- Dados comuns do cliente
- Dados especificos de PF
- Dados especificos de PJ
- Dados do responsavel
- Colecoes de contato e e-mail
- Endereco
- Preferencias de comunicacao
- Dados financeiros

## 5. Modelo de dominio proposto

## 5.1 Aggregate root

### `Customer`

Responsavel pelo ciclo de vida do cadastro principal.

Campos centrais sugeridos:

- `id`
- `personType`
- `active`
- `customerSince`
- `classification`
- `referralSource`
- `referralName`
- `allowsInvoice`
- `hasRestriction`
- `isFinalConsumer`
- `isRuralProducer`
- `notes`
- `createdAt`
- `updatedAt`
- `deletedAt`

## 5.2 Perfis especializados

### `CustomerIndividualProfile`

Campos especificos de pessoa fisica:

- `customerId`
- `cpf`
- `rg`
- `fullName`
- `nickname`
- `birthDate`
- `gender`
- `familyRelationship`
- `profession`
- `driverLicenseExpiresAt`

### `CustomerCompanyProfile`

Campos especificos de pessoa juridica:

- `customerId`
- `cnpj`
- `stateRegistration`
- `corporateName`
- `tradeName`
- `municipalRegistration`
- `suframaRegistration`
- `taxpayerType`
- `openingDate`
- `companySegment`
- `issWithheld`

## 5.3 Dados financeiros

### `CustomerFinancialProfile`

Campos sugeridos:

- `customerId`
- `creditLimit`
- `amountSpent`
- `balance`
- `consumedAmount`
- `costAmount`
- `profitabilityAmount`
- `profitabilityPercentage`
- `commissionPercentage`
- `paymentDay`
- `pixKeyOrDescription`

## 5.4 Endereco

### `CustomerAddress`

Pode ser tabela propria ou embutido em `customers`. Como existe um unico endereco principal na tela, a sugestao inicial e manter uma tabela propria simples para organizacao.

Campos:

- `customerId`
- `zipCode`
- `street`
- `number`
- `complement`
- `district`
- `city`
- `state`
- `cityCode`
- `stateCode`
- `reference`

## 5.5 Contatos e e-mails

### `CustomerContact`

- `id`
- `customerId`
- `value`
- `type`
- `isWhatsapp`
- `label`

Tipos iniciais sugeridos:

- `PHONE`
- `MOBILE`
- `MESSAGING`

### `CustomerEmail`

- `id`
- `customerId`
- `email`
- `label`

## 5.6 Preferencias de comunicacao

### `CustomerCommunicationPreference`

Representa os canais e assuntos aceitos para envio de mensagens.

Campos:

- `id`
- `customerId`
- `channel`
- `topic`
- `enabled`

Exemplos de `channel`:

- `PHONE`
- `EMAIL`

Exemplos de `topic`:

- `KM_UPDATE`
- `CHARGING`
- `MAINTENANCE_ALERT`
- `CAMPAIGNS`
- `NPS`
- `INVOICE`
- `NEXT_REVISIONS`
- `SERVICE_ORDER_COMPLETED`
- `BUDGET_APPROVAL`
- `BIRTHDAY`

## 5.7 Responsavel

### `Responsible`

Entidade filha de `Customer`.

Campos sugeridos:

- `id`
- `customerId`
- `cpf`
- `rg`
- `fullName`
- `nickname`
- `birthDate`
- `gender`
- `familyRelationship`
- `role`
- `profession`
- `driverLicenseExpiresAt`
- `active`
- `customerSince`
- `referralSource`
- `referralName`
- `notes`
- `createdAt`
- `updatedAt`

Relacionamentos filhos do responsavel:

- `ResponsibleAddress`
- `ResponsibleContact`
- `ResponsibleEmail`

Observacao:

- Como o formulario do responsavel tem campos muito parecidos com PF, e valido tratar esse bloco como entidade dedicada, sem tentar forcar heranca excessiva.

## 6. Modelo relacional inicial

Tabelas propostas:

- `users`
- `refresh_tokens`
- `customers`
- `customer_individual_profiles`
- `customer_company_profiles`
- `customer_financial_profiles`
- `customer_addresses`
- `customer_contacts`
- `customer_emails`
- `customer_communication_preferences`
- `responsibles`
- `responsible_addresses`
- `responsible_contacts`
- `responsible_emails`

Relacionamentos principais:

- `customers 1:1 customer_individual_profiles`
- `customers 1:1 customer_company_profiles`
- `customers 1:1 customer_financial_profiles`
- `customers 1:1 customer_addresses`
- `customers 1:N customer_contacts`
- `customers 1:N customer_emails`
- `customers 1:N customer_communication_preferences`
- `customers 1:N responsibles`
- `responsibles 1:1 responsible_addresses`
- `responsibles 1:N responsible_contacts`
- `responsibles 1:N responsible_emails`

Restricoes importantes:

- `customer_individual_profiles.cpf` unico
- `customer_company_profiles.cnpj` unico
- `users.username` unico
- `users.email` unico se existir

## 7. Campos comuns, obrigatorios e importantes

As telas usam duas marcacoes visuais:

- Vermelho = obrigatorio
- Verde = importante

Essas informacoes nao devem ficar presas ao frontend. O backend deve expor metadados de formulario para padronizacao futura.

### Estrutura conceitual de metadado

Cada campo podera ter:

- `fieldKey`
- `label`
- `section`
- `required`
- `importance`
- `inputType`
- `mask`
- `multiValue`
- `computed`
- `visibleWhen`
- `options`

### Exemplo conceitual

```json
{
  "fieldKey": "profile.fullName",
  "label": "Nome Completo",
  "section": "personal-data",
  "required": true,
  "importance": "HIGH",
  "inputType": "text",
  "mask": null,
  "multiValue": false,
  "computed": false,
  "visibleWhen": {
    "personType": ["INDIVIDUAL"]
  }
}
```

### Beneficio

Esse modelo permite:

- Reaproveitamento nos proximos formularios
- Padronizacao de UI por regras centrais
- Menor acoplamento entre frontend e backend
- Evolucao gradual sem criar um form builder complexo cedo demais

## 7.1 Matriz inicial de campos

Observacao importante:

- A matriz abaixo representa a versao inicial do backend
- `Obrigatorio` significa validacao de entrada obrigatoria
- `Importante` significa metadado de formulario, nao bloqueio de persistencia
- Campos calculados aparecem no response e podem ser exibidos no frontend, mas nao devem ser tratados como entrada de negocio primaria

### Cliente PF

| Campo | Obrigatorio | Importante | Observacao |
| --- | --- | --- | --- |
| `personType` | Sim | Sim | Valor fixo `INDIVIDUAL` |
| `profile.cpf` | Sim | Sim | Unico e sem mascara no banco |
| `profile.fullName` | Sim | Sim | Campo principal de identificacao |
| `profile.rg` | Nao | Nao | Opcional |
| `profile.nickname` | Nao | Nao | Opcional |
| `profile.birthDate` | Nao | Sim | Permite calcular idade |
| `profile.gender` | Nao | Sim | Opcional de negocio |
| `profile.familyRelationship` | Nao | Sim | Opcional |
| `profile.profession` | Nao | Nao | Opcional |
| `profile.driverLicenseExpiresAt` | Nao | Nao | Opcional |
| `core.active` | Sim | Nao | Default `true` se omitido |
| `core.customerSince` | Nao | Nao | Opcional |
| `core.classification` | Nao | Nao | Ex.: atacado, varejo, lojista |
| `core.referralSource` | Nao | Sim | Ex.: amigo, instagram |
| `core.referralName` | Nao | Nao | Nome do amigo/indicador |
| `core.allowsInvoice` | Nao | Nao | Default `false` |
| `core.hasRestriction` | Nao | Nao | Default `false` |
| `core.isFinalConsumer` | Nao | Nao | Opcional |
| `core.isRuralProducer` | Nao | Nao | Opcional |
| `core.notes` | Nao | Nao | Observacao livre |
| `financial.creditLimit` | Nao | Nao | Monetario |
| `financial.amountSpent` | Nao | Nao | Monetario |
| `financial.balance` | Nao | Nao | Monetario |
| `financial.consumedAmount` | Nao | Nao | Base para calculo |
| `financial.costAmount` | Nao | Nao | Base para calculo |
| `financial.commissionPercentage` | Nao | Nao | Percentual |
| `financial.paymentDay` | Nao | Nao | Dia do mes |
| `financial.pixKeyOrDescription` | Nao | Nao | Texto livre |
| `address.zipCode` | Nao | Nao | Sem mascara no banco |
| `address.street` | Nao | Nao | Texto livre |
| `address.number` | Nao | Nao | Texto livre |
| `address.complement` | Nao | Nao | Texto livre |
| `address.district` | Nao | Nao | Texto livre |
| `address.city` | Nao | Nao | Texto livre |
| `address.state` | Nao | Nao | Texto livre |
| `address.cityCode` | Nao | Nao | Texto livre |
| `address.stateCode` | Nao | Nao | Texto livre |
| `address.reference` | Nao | Nao | Texto livre |
| `contacts[]` | Nao | Sim | Multiplo; telefone/celular |
| `emails[]` | Nao | Sim | Multiplo |
| `communicationPreferences[]` | Nao | Nao | Multiplo |
| `responsibles[]` | Nao | Nao | Deve ser vazio para PF |

### Cliente PJ

| Campo | Obrigatorio | Importante | Observacao |
| --- | --- | --- | --- |
| `personType` | Sim | Sim | Valor fixo `COMPANY` |
| `profile.cnpj` | Sim | Sim | Unico e sem mascara no banco |
| `profile.corporateName` | Sim | Sim | Razao social |
| `profile.tradeName` | Sim | Sim | Nome fantasia |
| `profile.stateRegistration` | Nao | Nao | Opcional |
| `profile.municipalRegistration` | Nao | Nao | Opcional |
| `profile.suframaRegistration` | Nao | Nao | Opcional |
| `profile.taxpayerType` | Nao | Nao | Ex.: contribuinte ICMS |
| `profile.openingDate` | Nao | Nao | Permite calcular idade da empresa |
| `profile.companySegment` | Nao | Nao | Texto livre |
| `profile.issWithheld` | Nao | Nao | Booleano |
| `core.active` | Sim | Nao | Default `true` se omitido |
| `core.customerSince` | Nao | Nao | Opcional |
| `core.classification` | Nao | Nao | Ex.: varejo, atacado, lojista |
| `core.referralSource` | Nao | Sim | Ex.: amigo, instagram |
| `core.referralName` | Nao | Nao | Nome do indicador |
| `core.allowsInvoice` | Nao | Nao | Default `false` |
| `core.hasRestriction` | Nao | Nao | Default `false` |
| `core.isFinalConsumer` | Nao | Nao | Opcional |
| `core.isRuralProducer` | Nao | Nao | Opcional |
| `core.notes` | Nao | Nao | Observacao livre |
| `financial.creditLimit` | Nao | Nao | Monetario |
| `financial.amountSpent` | Nao | Nao | Monetario |
| `financial.balance` | Nao | Nao | Monetario |
| `financial.consumedAmount` | Nao | Nao | Base para calculo |
| `financial.costAmount` | Nao | Nao | Base para calculo |
| `financial.commissionPercentage` | Nao | Nao | Percentual |
| `financial.paymentDay` | Nao | Nao | Dia do mes |
| `financial.pixKeyOrDescription` | Nao | Nao | Texto livre |
| `address.zipCode` | Nao | Nao | Sem mascara no banco |
| `address.street` | Nao | Nao | Texto livre |
| `address.number` | Nao | Nao | Texto livre |
| `address.complement` | Nao | Nao | Texto livre |
| `address.district` | Nao | Nao | Texto livre |
| `address.city` | Nao | Nao | Texto livre |
| `address.state` | Nao | Nao | Texto livre |
| `address.cityCode` | Nao | Nao | Texto livre |
| `address.stateCode` | Nao | Nao | Texto livre |
| `address.reference` | Nao | Nao | Texto livre |
| `contacts[]` | Nao | Sim | Multiplo; telefone/celular |
| `emails[]` | Nao | Sim | Multiplo |
| `communicationPreferences[]` | Nao | Nao | Multiplo |
| `responsibles[]` | Sim | Sim | Ao menos um responsavel |

### Responsavel

| Campo | Obrigatorio | Importante | Observacao |
| --- | --- | --- | --- |
| `fullName` | Sim | Sim | Campo principal |
| `cpf` | Nao | Nao | Opcional inicialmente |
| `rg` | Nao | Nao | Opcional |
| `nickname` | Nao | Nao | Opcional |
| `birthDate` | Nao | Sim | Permite calcular idade |
| `gender` | Nao | Sim | Opcional |
| `familyRelationship` | Nao | Sim | Opcional |
| `role` | Nao | Nao | Cargo |
| `profession` | Nao | Nao | Opcional |
| `driverLicenseExpiresAt` | Nao | Nao | Opcional |
| `active` | Sim | Nao | Default `true` se omitido |
| `customerSince` | Nao | Nao | Opcional |
| `referralSource` | Nao | Sim | Ex.: amigo, instagram |
| `referralName` | Nao | Nao | Nome do indicador |
| `notes` | Nao | Nao | Observacao livre |
| `address.zipCode` | Nao | Nao | Sem mascara no banco |
| `address.street` | Nao | Nao | Texto livre |
| `address.number` | Nao | Nao | Texto livre |
| `address.complement` | Nao | Nao | Texto livre |
| `address.district` | Nao | Nao | Texto livre |
| `address.city` | Nao | Nao | Texto livre |
| `address.state` | Nao | Nao | Texto livre |
| `address.cityCode` | Nao | Nao | Texto livre |
| `address.stateCode` | Nao | Nao | Texto livre |
| `address.reference` | Nao | Nao | Texto livre |
| `contacts[]` | Nao | Sim | Multiplo |
| `emails[]` | Nao | Sim | Multiplo |

### Campos calculados

| Campo | Origem | Persistencia |
| --- | --- | --- |
| `computed.customerAge` | `profile.birthDate` | Nao obrigatoria |
| `computed.companyAge` | `profile.openingDate` | Nao obrigatoria |
| `computed.responsibleAge` | `responsible.birthDate` | Nao obrigatoria |
| `computed.profitabilityAmount` | `consumedAmount - costAmount` | Pode ser persistido para consulta |
| `computed.profitabilityPercentage` | `profitabilityAmount / consumedAmount * 100` | Pode ser persistido para consulta |

## 8. Contratos de API

## 8.1 Autenticacao

Rotas iniciais:

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

Decisoes:

- Nao havera cadastro publico de usuario
- Usuario inicial sera criado por seed ou migration
- Login com usuario e senha
- JWT access token + refresh token

## 8.2 Clientes

Rotas iniciais:

- `POST /customers`
- `GET /customers`
- `GET /customers/:id`
- `PATCH /customers/:id`
- `DELETE /customers/:id`
- `GET /customers/search`

Busca:

- `GET /customers/search?query=...`
- Deve buscar por nome, CPF ou CNPJ
- O objetivo inicial e suportar o preenchimento do campo de indicacao

## 8.3 Responsaveis

Subrecurso do cliente:

- `POST /customers/:customerId/responsibles`
- `GET /customers/:customerId/responsibles`
- `GET /customers/:customerId/responsibles/:responsibleId`
- `PATCH /customers/:customerId/responsibles/:responsibleId`
- `DELETE /customers/:customerId/responsibles/:responsibleId`

## 8.4 Metadados de formulario

Rotas sugeridas:

- `GET /form-metadata/customers`
- `GET /form-metadata/responsibles`

## 9. DTOs propostos

Nao usar DTO plano gigante. O payload deve ser organizado por secoes.

### 9.1 CreateCustomerRequest

```json
{
  "personType": "INDIVIDUAL",
  "core": {
    "active": true,
    "customerSince": "2026-04-02",
    "classification": "VAREJO",
    "referralSource": "AMIGO",
    "referralName": "Maria Antonia",
    "allowsInvoice": false,
    "hasRestriction": false,
    "isFinalConsumer": true,
    "isRuralProducer": false,
    "notes": "..."
  },
  "profile": {},
  "financial": {
    "creditLimit": 30000,
    "amountSpent": 10000,
    "balance": 20000,
    "consumedAmount": 200000,
    "costAmount": 120000,
    "commissionPercentage": 0,
    "paymentDay": 10,
    "pixKeyOrDescription": "..."
  },
  "address": {
    "zipCode": "00000000",
    "street": "Rua X",
    "number": "123",
    "complement": "Sala 2",
    "district": "Centro",
    "city": "Sao Paulo",
    "state": "SP",
    "cityCode": "123",
    "stateCode": "35",
    "reference": "..."
  },
  "contacts": [
    {
      "value": "11999999999",
      "type": "MOBILE",
      "isWhatsapp": true
    }
  ],
  "emails": [
    {
      "email": "contato@empresa.com"
    }
  ],
  "communicationPreferences": [
    {
      "channel": "PHONE",
      "topic": "KM_UPDATE",
      "enabled": true
    }
  ],
  "responsibles": []
}
```

### 9.2 Regras do DTO

- `profile` muda conforme `personType`
- Para `INDIVIDUAL`, o payload de `profile` deve aceitar os campos de PF
- Para `COMPANY`, o payload de `profile` deve aceitar os campos de PJ
- Para `COMPANY`, `responsibles` deve aceitar um ou mais itens
- Para `INDIVIDUAL`, `responsibles` deve ser vazio ou omitido

### 9.3 Response

O response pode espelhar o request e incluir uma secao `computed`.

Exemplo conceitual:

```json
{
  "id": "uuid",
  "personType": "COMPANY",
  "core": {},
  "profile": {},
  "financial": {},
  "address": {},
  "contacts": [],
  "emails": [],
  "communicationPreferences": [],
  "responsibles": [],
  "computed": {
    "companyAge": 15,
    "profitabilityAmount": 115000,
    "profitabilityPercentage": 76.67
  }
}
```

## 10. Validacoes principais

### 10.1 Documento

- Validar formato e digitos de CPF quando `INDIVIDUAL`
- Validar formato e digitos de CNPJ quando `COMPANY`
- Persistir documento sem mascara

### 10.2 Contato

- Persistir telefones sem mascara
- Validar quantidade minima de contatos conforme regra futura

### 10.3 E-mail

- Validar formato
- Permitir varios e-mails

### 10.4 Responsavel

- Exigir ao menos um responsavel para `COMPANY`
- Nao permitir responsavel em cliente `INDIVIDUAL`, exceto se a regra mudar futuramente

### 10.5 Financeiro

- Valores monetarios devem ser maiores ou iguais a zero, salvo regra especifica futura
- Calculos financeiros devem ser refeitos no backend

## 11. Arquitetura da aplicacao

Estrutura proposta por modulo e camada:

```text
src/
  modules/
    auth/
      domain/
      application/
      infrastructure/
      interfaces/http/
    customers/
      domain/
      application/
      infrastructure/
      interfaces/http/
    form-metadata/
      domain/
      application/
      infrastructure/
      interfaces/http/
  shared/
    domain/
    application/
    infrastructure/
    interfaces/
  main/
    http/
    config/
```

### Regras arquiteturais

- `domain` nao depende de Express nem TypeORM
- `application` orquestra casos de uso
- `infrastructure` implementa repositorios, auth, banco e adaptadores externos
- `interfaces/http` contem controllers, mappers e validacao de entrada
- Casos de uso pequenos e focados
- Repositorios por agregado ou subagregado, sem concentrar tudo em um unico service

## 12. Estrategia com TypeORM

TypeORM deve ficar restrito a infraestrutura:

- Entities ORM separadas dos modelos de dominio se necessario
- Migrations obrigatorias
- Seeds apenas para usuario inicial e dados minimos de referencia

Tipos recomendados no PostgreSQL:

- `uuid` para chaves primarias
- `varchar` para textos curtos
- `text` para observacao
- `date` para datas puras
- `numeric(14,2)` para dinheiro
- `numeric(5,2)` para percentual
- `boolean` para flags

## 13. Autenticacao

Escopo inicial:

- Usuario seedado
- Senha com hash
- JWT access token
- Refresh token persistido

Campos sugeridos para `users`:

- `id`
- `username`
- `passwordHash`
- `active`
- `createdAt`
- `updatedAt`

Campos sugeridos para `refresh_tokens`:

- `id`
- `userId`
- `tokenHash`
- `expiresAt`
- `revokedAt`
- `createdAt`

## 14. Casos de uso iniciais

### Auth

- `LoginUser`
- `RefreshSession`
- `GetCurrentUser`

### Customers

- `CreateCustomer`
- `UpdateCustomer`
- `DeleteCustomer`
- `GetCustomerById`
- `ListCustomers`
- `SearchCustomers`

### Responsibles

- `AddResponsibleToCustomer`
- `UpdateResponsible`
- `RemoveResponsible`
- `GetResponsible`
- `ListResponsiblesByCustomer`

### Form metadata

- `GetCustomerFormMetadata`
- `GetResponsibleFormMetadata`

## 15. Decisoes tecnicas importantes

1. Nao usar uma unica tabela com todos os campos de PF e PJ.
2. Nao usar JSON para contatos e e-mails.
3. Nao persistir idade como fonte de verdade.
4. Calcular lucratividade no backend.
5. Tratar responsavel como entidade filha do cliente.
6. Expor metadados de formulario para padronizar obrigatoriedade e importancia.
7. Manter cidade e estado como texto livre nesta fase.

## 16. Fases de execucao

### Fase 1

- Inicializacao do projeto
- Configuracao de ambiente
- Estrutura base da arquitetura
- Logger
- Tratamento global de erros
- Configuracao do TypeORM
- Docker para Postgres, se desejado

### Fase 2

- Modulo de autenticacao
- Usuario seedado
- JWT e refresh token

### Fase 3

- Modulo de clientes
- Criacao de PF e PJ
- Listagem, detalhe, atualizacao e exclusao
- Busca por nome/CPF/CNPJ

### Fase 4

- Modulo de responsaveis
- CRUD como subrecurso de cliente

### Fase 5

- Metadados de formulario
- Preferencias de comunicacao
- Ajustes finos de validacao

### Fase 6

- Testes unitarios
- Testes de integracao
- Documentacao OpenAPI

## 17. Pontos abertos para a fase de implementacao

Os seguintes itens poderao ser detalhados antes de codar:

- Campos obrigatorios exatos por tipo de pessoa
- Enumeracoes oficiais do sistema
- Formato exato do login: username ou e-mail
- Estrategia de soft delete ou hard delete
- Regras de paginacao e ordenacao da listagem de clientes
- Se preferencias de comunicacao serao por canal, por assunto ou ambos

## 18. Conclusao

O projeto deve nascer com um agregado principal de cliente, perfis especificos para PF e PJ, responsaveis como filhos apenas para PJ, colecoes relacionais para contatos e e-mails, e uma camada de metadados para formularios. Essa estrutura evita duplicacao, reduz acoplamento com o frontend e permite crescimento futuro sem comprometer a arquitetura.
