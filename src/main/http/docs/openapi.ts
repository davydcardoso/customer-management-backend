import type { OpenAPIObject } from 'openapi3-ts/oas31';

const bearerSecurityScheme = {
  bearerAuth: [],
};

export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'ZR System Backend API',
    version: '1.0.0',
    description:
      'API para autenticacao, cadastro de clientes PF/PJ, responsaveis vinculados e metadados de formulario.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  tags: [
    { name: 'Health', description: 'Estado da aplicacao' },
    { name: 'Auth', description: 'Autenticacao e sessao' },
    { name: 'Customers', description: 'Cadastro principal de clientes PF/PJ' },
    { name: 'Responsibles', description: 'Cadastro filho de responsaveis do cliente PJ' },
    { name: 'Form Metadata', description: 'Metadados para construcao dos formularios' },
    { name: 'Documentation', description: 'Especificacao OpenAPI e documentacao visual' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        description: 'Resposta padrao para erros de validacao, autenticacao ou regra de negocio.',
        properties: {
          message: { type: 'string', description: 'Mensagem legivel que explica o erro retornado pela API.' },
          code: { type: 'string', description: 'Codigo estavel do erro para tratamento no frontend.' },
          details: { description: 'Detalhes adicionais do erro, quando houver, como falhas de validacao por campo.' },
        },
        required: ['message', 'code'],
      },
      HealthResponse: {
        type: 'object',
        description: 'Resposta simples para verificar se a aplicacao respondeu com sucesso.',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
            description: 'Indica que a API esta operacional.',
          },
        },
        required: ['status'],
      },
      LoginRequest: {
        type: 'object',
        description: 'Credenciais para autenticacao de um usuario previamente seedado no sistema.',
        properties: {
          username: {
            type: 'string',
            example: 'admin',
            description: 'Nome de usuario usado para autenticar no sistema.',
          },
          password: {
            type: 'string',
            example: 'admin123',
            description: 'Senha em texto puro enviada apenas no login para gerar a sessao.',
          },
        },
        required: ['username', 'password'],
      },
      RefreshSessionRequest: {
        type: 'object',
        description: 'Payload usado para trocar um refresh token valido por novos tokens de sessao.',
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Token de longa duracao que permite renovar a sessao sem novo login.',
          },
        },
        required: ['refreshToken'],
      },
      AuthUser: {
        type: 'object',
        description: 'Representacao resumida do usuario autenticado.',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Identificador unico do usuario.' },
          username: { type: 'string', description: 'Nome de usuario usado para login.' },
          active: {
            type: 'boolean',
            description: 'Indica se o usuario pode autenticar e usar a API.',
          },
        },
        required: ['id', 'username'],
      },
      LoginResponse: {
        type: 'object',
        description: 'Resposta de login contendo os tokens da sessao e os dados basicos do usuario.',
        properties: {
          accessToken: {
            type: 'string',
            description: 'Token JWT de curta duracao usado no header Authorization das rotas protegidas.',
          },
          refreshToken: {
            type: 'string',
            description: 'Token JWT de longa duracao usado para renovar a sessao.',
          },
          user: {
            $ref: '#/components/schemas/AuthUser',
            description: 'Dados do usuario autenticado.',
          },
        },
        required: ['accessToken', 'refreshToken', 'user'],
      },
      RefreshSessionResponse: {
        type: 'object',
        description: 'Resposta gerada ao renovar a sessao com um refresh token valido.',
        properties: {
          accessToken: {
            type: 'string',
            description: 'Novo token de acesso para continuar consumindo a API.',
          },
          refreshToken: {
            type: 'string',
            description: 'Novo refresh token que substitui o anterior.',
          },
        },
        required: ['accessToken', 'refreshToken'],
      },
      CustomerCoreInput: {
        type: 'object',
        description: 'Bloco com informacoes centrais do cadastro, comuns a pessoa fisica e juridica.',
        properties: {
          active: {
            type: 'boolean',
            default: true,
            description: 'Define se o cliente esta ativo no sistema e disponivel para operacoes futuras.',
          },
          customerSince: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data a partir da qual o cliente passou a ser considerado cliente da empresa.',
          },
          classification: {
            type: 'string',
            nullable: true,
            description: 'Classificacao comercial do cliente, como varejo, atacado ou lojista.',
          },
          referralSource: {
            type: 'string',
            nullable: true,
            description: 'Origem de captacao do cliente, usada para analise comercial e marketing.',
          },
          referralName: {
            type: 'string',
            nullable: true,
            description: 'Nome do amigo ou indicador associado ao cadastro.',
          },
          allowsInvoice: {
            type: 'boolean',
            nullable: true,
            description: 'Indica se o cliente opera com emissao de nota fiscal.',
          },
          hasRestriction: {
            type: 'boolean',
            nullable: true,
            description: 'Marca que o cliente possui alguma restricao comercial ou financeira.',
          },
          isFinalConsumer: {
            type: 'boolean',
            nullable: true,
            description: 'Informa se o cliente e consumidor final para fins comerciais e fiscais.',
          },
          isRuralProducer: {
            type: 'boolean',
            nullable: true,
            description: 'Informa se o cliente se enquadra como produtor rural.',
          },
          notes: {
            type: 'string',
            nullable: true,
            description: 'Observacoes livres sobre o cliente para uso operacional.',
          },
        },
      },
      CustomerFinancialInput: {
        type: 'object',
        description: 'Bloco financeiro do cliente. Parte dele e entrada e parte gera calculos de lucratividade.',
        properties: {
          creditLimit: {
            type: 'number',
            nullable: true,
            description: 'Credito liberado para o cliente no relacionamento comercial.',
          },
          amountSpent: {
            type: 'number',
            nullable: true,
            description: 'Valor que o cliente ja gastou no contexto definido pela operacao.',
          },
          balance: {
            type: 'number',
            nullable: true,
            description: 'Saldo financeiro associado ao cliente.',
          },
          consumedAmount: {
            type: 'number',
            nullable: true,
            description: 'Valor consumido usado como base para calcular lucratividade.',
          },
          costAmount: {
            type: 'number',
            nullable: true,
            description: 'Valor de custos usado como base para calcular lucratividade.',
          },
          commissionPercentage: {
            type: 'number',
            nullable: true,
            description: 'Percentual de comissao por indicacao associado ao cliente.',
          },
          paymentDay: {
            type: 'integer',
            minimum: 1,
            maximum: 31,
            nullable: true,
            description: 'Dia preferencial de pagamento do cliente.',
          },
          pixKeyOrDescription: {
            type: 'string',
            nullable: true,
            description: 'Chave Pix ou descricao relacionada ao recebimento/pagamento do cliente.',
          },
        },
      },
      AddressInput: {
        type: 'object',
        description: 'Endereco principal do cliente ou do responsavel.',
        properties: {
          zipCode: {
            type: 'string',
            nullable: true,
            description: 'CEP do endereco. E armazenado sem mascara.',
          },
          street: {
            type: 'string',
            nullable: true,
            description: 'Logradouro do endereco principal.',
          },
          number: {
            type: 'string',
            nullable: true,
            description: 'Numero do endereco. Aceita letras quando necessario.',
          },
          complement: {
            type: 'string',
            nullable: true,
            description: 'Complemento do endereco, como sala, bloco ou apartamento.',
          },
          district: {
            type: 'string',
            nullable: true,
            description: 'Bairro do endereco.',
          },
          city: {
            type: 'string',
            nullable: true,
            description: 'Cidade em texto livre, conforme decisao atual do projeto.',
          },
          state: {
            type: 'string',
            nullable: true,
            description: 'Estado em texto livre, conforme decisao atual do projeto.',
          },
          cityCode: {
            type: 'string',
            nullable: true,
            description: 'Codigo interno ou externo da cidade, caso o frontend envie esse dado.',
          },
          stateCode: {
            type: 'string',
            nullable: true,
            description: 'Codigo interno ou externo do estado, caso o frontend envie esse dado.',
          },
          reference: {
            type: 'string',
            nullable: true,
            description: 'Ponto de referencia para facilitar localizacao.',
          },
        },
      },
      ContactInput: {
        type: 'object',
        description: 'Item de contato multiplo. O sistema permite mais de um contato por cliente ou responsavel.',
        properties: {
          value: {
            type: 'string',
            description: 'Numero ou identificador do contato. Telefones sao normalizados sem mascara.',
          },
          type: {
            type: 'string',
            enum: ['PHONE', 'MOBILE', 'MESSAGING'],
            description: 'Tipo do contato para diferenciar telefone fixo, celular ou canal de mensagens.',
          },
          isWhatsapp: {
            type: 'boolean',
            default: false,
            description: 'Indica se o contato aceita ou representa comunicacao via WhatsApp.',
          },
          label: {
            type: 'string',
            nullable: true,
            description: 'Rotulo opcional para identificar o contato, como comercial ou financeiro.',
          },
        },
        required: ['value', 'type'],
      },
      EmailInput: {
        type: 'object',
        description: 'Item de e-mail multiplo vinculado ao cadastro.',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Endereco de e-mail valido. E armazenado normalizado em minusculo.',
          },
          label: {
            type: 'string',
            nullable: true,
            description: 'Rotulo opcional para identificar a finalidade do e-mail.',
          },
        },
        required: ['email'],
      },
      CommunicationPreferenceInput: {
        type: 'object',
        description: 'Preferencia de comunicacao por canal e assunto.',
        properties: {
          channel: {
            type: 'string',
            enum: ['PHONE', 'EMAIL'],
            description: 'Canal pelo qual a comunicacao sera enviada.',
          },
          topic: {
            type: 'string',
            enum: [
              'KM_UPDATE',
              'CHARGING',
              'MAINTENANCE_ALERT',
              'CAMPAIGNS',
              'NPS',
              'INVOICE',
              'NEXT_REVISIONS',
              'SERVICE_ORDER_COMPLETED',
              'BUDGET_APPROVAL',
              'BIRTHDAY',
            ],
            description: 'Assunto da comunicacao que o cliente aceita ou recusa receber.',
          },
          enabled: {
            type: 'boolean',
            description: 'Define se a combinacao de canal e assunto esta autorizada para envio.',
          },
        },
        required: ['channel', 'topic', 'enabled'],
      },
      IndividualProfileInput: {
        type: 'object',
        description: 'Perfil especifico de pessoa fisica.',
        properties: {
          cpf: {
            type: 'string',
            description: 'CPF da pessoa fisica. Documento unico no sistema e armazenado sem mascara.',
          },
          rg: {
            type: 'string',
            nullable: true,
            description: 'RG da pessoa fisica, quando informado.',
          },
          fullName: {
            type: 'string',
            description: 'Nome completo do cliente. E o principal identificador textual da PF.',
          },
          nickname: {
            type: 'string',
            nullable: true,
            description: 'Apelido ou nome social usado para facilitar identificacao.',
          },
          birthDate: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data de nascimento usada para exibir idade calculada.',
          },
          gender: {
            type: 'string',
            nullable: true,
            description: 'Genero informado no cadastro, quando relevante para o negocio.',
          },
          familyRelationship: {
            type: 'string',
            nullable: true,
            description: 'Relacao familiar destacada no cadastro, quando aplicavel.',
          },
          profession: {
            type: 'string',
            nullable: true,
            description: 'Profissao do cliente pessoa fisica.',
          },
          driverLicenseExpiresAt: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data de vencimento da CNH, quando houver uso desse dado na operacao.',
          },
        },
        required: ['cpf', 'fullName'],
      },
      CompanyProfileInput: {
        type: 'object',
        description: 'Perfil especifico de pessoa juridica.',
        properties: {
          cnpj: {
            type: 'string',
            description: 'CNPJ da empresa. Documento unico no sistema e armazenado sem mascara.',
          },
          stateRegistration: {
            type: 'string',
            nullable: true,
            description: 'Inscricao estadual da empresa.',
          },
          corporateName: {
            type: 'string',
            description: 'Razao social da empresa. E o principal identificador formal do cadastro PJ.',
          },
          tradeName: {
            type: 'string',
            description: 'Nome fantasia usado comercialmente.',
          },
          municipalRegistration: {
            type: 'string',
            nullable: true,
            description: 'Inscricao municipal da empresa.',
          },
          suframaRegistration: {
            type: 'string',
            nullable: true,
            description: 'Inscricao SUFRAMA, quando aplicavel.',
          },
          taxpayerType: {
            type: 'string',
            nullable: true,
            description: 'Tipo de contribuinte usado em contexto fiscal.',
          },
          openingDate: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data de abertura da empresa, usada para exibir idade calculada da empresa.',
          },
          companySegment: {
            type: 'string',
            nullable: true,
            description: 'Segmento de atuacao da empresa.',
          },
          issWithheld: {
            type: 'boolean',
            nullable: true,
            description: 'Indica se ha retencao de ISS na fonte.',
          },
        },
        required: ['cnpj', 'corporateName', 'tradeName'],
      },
      ResponsibleInput: {
        type: 'object',
        description: 'Cadastro filho vinculado ao cliente PJ. Um cliente PJ deve manter ao menos um responsavel.',
        properties: {
          fullName: {
            type: 'string',
            description: 'Nome completo do responsavel. Campo principal de identificacao.',
          },
          cpf: {
            type: 'string',
            nullable: true,
            description: 'CPF do responsavel, quando informado.',
          },
          rg: {
            type: 'string',
            nullable: true,
            description: 'RG do responsavel.',
          },
          nickname: {
            type: 'string',
            nullable: true,
            description: 'Apelido ou nome social do responsavel.',
          },
          birthDate: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data de nascimento usada para exibir idade calculada.',
          },
          gender: {
            type: 'string',
            nullable: true,
            description: 'Genero informado no cadastro.',
          },
          familyRelationship: {
            type: 'string',
            nullable: true,
            description: 'Relacao familiar do responsavel com o titular ou empresa, quando fizer sentido na operacao.',
          },
          role: {
            type: 'string',
            nullable: true,
            description: 'Cargo ou funcao do responsavel na empresa.',
          },
          profession: {
            type: 'string',
            nullable: true,
            description: 'Profissao do responsavel.',
          },
          driverLicenseExpiresAt: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Vencimento da CNH do responsavel, quando relevante.',
          },
          active: {
            type: 'boolean',
            nullable: true,
            description: 'Indica se o responsavel esta ativo para relacionamento e operacao.',
          },
          customerSince: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data de vinculacao ou inicio do relacionamento do responsavel.',
          },
          referralSource: {
            type: 'string',
            nullable: true,
            description: 'Origem de captacao associada ao responsavel.',
          },
          referralName: {
            type: 'string',
            nullable: true,
            description: 'Nome do amigo ou indicador associado ao responsavel.',
          },
          notes: {
            type: 'string',
            nullable: true,
            description: 'Observacoes livres sobre o responsavel.',
          },
          address: {
            $ref: '#/components/schemas/AddressInput',
            description: 'Endereco principal do responsavel.',
          },
          contacts: {
            type: 'array',
            items: { $ref: '#/components/schemas/ContactInput' },
            description: 'Colecao de contatos do responsavel.',
          },
          emails: {
            type: 'array',
            items: { $ref: '#/components/schemas/EmailInput' },
            description: 'Colecao de e-mails do responsavel.',
          },
        },
        required: ['fullName'],
      },
      CreateIndividualCustomerRequest: {
        type: 'object',
        description: 'Payload para criar um cliente pessoa fisica.',
        properties: {
          personType: {
            type: 'string',
            enum: ['INDIVIDUAL'],
            description: 'Discriminador do cadastro. Define que o perfil usado sera o de pessoa fisica.',
          },
          core: {
            $ref: '#/components/schemas/CustomerCoreInput',
            description: 'Informacoes comuns do cadastro.',
          },
          profile: {
            $ref: '#/components/schemas/IndividualProfileInput',
            description: 'Dados especificos do cliente pessoa fisica.',
          },
          financial: {
            $ref: '#/components/schemas/CustomerFinancialInput',
            description: 'Dados financeiros e base para calculos de lucratividade.',
          },
          address: {
            $ref: '#/components/schemas/AddressInput',
            description: 'Endereco principal do cliente.',
          },
          contacts: {
            type: 'array',
            items: { $ref: '#/components/schemas/ContactInput' },
            description: 'Colecao de contatos do cliente.',
          },
          emails: {
            type: 'array',
            items: { $ref: '#/components/schemas/EmailInput' },
            description: 'Colecao de e-mails do cliente.',
          },
          communicationPreferences: {
            type: 'array',
            items: { $ref: '#/components/schemas/CommunicationPreferenceInput' },
            description: 'Preferencias de comunicacao por canal e assunto.',
          },
          responsibles: {
            type: 'array',
            maxItems: 0,
            items: { $ref: '#/components/schemas/ResponsibleInput' },
            description: 'Nao deve ser usado para PF. O backend espera vazio ou omitido.',
          },
        },
        required: ['personType', 'profile'],
      },
      CreateCompanyCustomerRequest: {
        type: 'object',
        description: 'Payload para criar um cliente pessoa juridica.',
        properties: {
          personType: {
            type: 'string',
            enum: ['COMPANY'],
            description: 'Discriminador do cadastro. Define que o perfil usado sera o de pessoa juridica.',
          },
          core: {
            $ref: '#/components/schemas/CustomerCoreInput',
            description: 'Informacoes comuns do cadastro.',
          },
          profile: {
            $ref: '#/components/schemas/CompanyProfileInput',
            description: 'Dados especificos da empresa.',
          },
          financial: {
            $ref: '#/components/schemas/CustomerFinancialInput',
            description: 'Dados financeiros e base para calculos de lucratividade.',
          },
          address: {
            $ref: '#/components/schemas/AddressInput',
            description: 'Endereco principal da empresa.',
          },
          contacts: {
            type: 'array',
            items: { $ref: '#/components/schemas/ContactInput' },
            description: 'Colecao de contatos da empresa.',
          },
          emails: {
            type: 'array',
            items: { $ref: '#/components/schemas/EmailInput' },
            description: 'Colecao de e-mails da empresa.',
          },
          communicationPreferences: {
            type: 'array',
            items: { $ref: '#/components/schemas/CommunicationPreferenceInput' },
            description: 'Preferencias de comunicacao por canal e assunto.',
          },
          responsibles: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/ResponsibleInput' },
            description: 'Colecao obrigatoria de responsaveis vinculados ao cliente PJ.',
          },
        },
        required: ['personType', 'profile', 'responsibles'],
      },
      UpdateCustomerRequest: {
        type: 'object',
        description:
          'Payload parcial para atualizar um cliente existente. O tipo de pessoa nao pode ser trocado apos criacao.',
        properties: {
          personType: {
            type: 'string',
            enum: ['INDIVIDUAL', 'COMPANY'],
            description: 'Tipo de pessoa do cadastro. A API rejeita troca de tipo apos criacao.',
          },
          core: {
            $ref: '#/components/schemas/CustomerCoreInput',
            description: 'Informacoes comuns do cadastro.',
          },
          profile: {
            oneOf: [
              { $ref: '#/components/schemas/IndividualProfileInput' },
              { $ref: '#/components/schemas/CompanyProfileInput' },
            ],
            description: 'Dados especificos do perfil PF ou PJ conforme o cadastro existente.',
          },
          financial: {
            $ref: '#/components/schemas/CustomerFinancialInput',
            description: 'Dados financeiros do cliente.',
          },
          address: {
            $ref: '#/components/schemas/AddressInput',
            description: 'Endereco principal do cliente.',
          },
          contacts: {
            type: 'array',
            items: { $ref: '#/components/schemas/ContactInput' },
            description: 'Substitui a colecao atual de contatos quando enviado.',
          },
          emails: {
            type: 'array',
            items: { $ref: '#/components/schemas/EmailInput' },
            description: 'Substitui a colecao atual de e-mails quando enviado.',
          },
          communicationPreferences: {
            type: 'array',
            items: { $ref: '#/components/schemas/CommunicationPreferenceInput' },
            description: 'Substitui as preferencias de comunicacao quando enviado.',
          },
          responsibles: {
            type: 'array',
            items: { $ref: '#/components/schemas/ResponsibleInput' },
            description: 'Para PJ, substitui a colecao atual de responsaveis quando enviado.',
          },
        },
      },
      CustomerResponse: {
        type: 'object',
        description: 'Representacao completa do cliente com dados comuns, perfil, relacionamentos e campos calculados.',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Identificador unico do cliente no sistema.',
          },
          personType: {
            type: 'string',
            enum: ['INDIVIDUAL', 'COMPANY'],
            description: 'Tipo de pessoa do cadastro.',
          },
          core: {
            $ref: '#/components/schemas/CustomerCoreInput',
            description: 'Bloco de dados comuns do cliente.',
          },
          profile: {
            type: 'object',
            description: 'Bloco de perfil especifico de PF ou PJ retornado conforme o tipo de pessoa.',
          },
          financial: {
            $ref: '#/components/schemas/CustomerFinancialInput',
            description: 'Bloco financeiro persistido do cliente.',
          },
          address: {
            $ref: '#/components/schemas/AddressInput',
            description: 'Endereco principal do cliente.',
          },
          contacts: {
            type: 'array',
            items: { type: 'object' },
            description: 'Lista de contatos cadastrados para o cliente.',
          },
          emails: {
            type: 'array',
            items: { type: 'object' },
            description: 'Lista de e-mails cadastrados para o cliente.',
          },
          communicationPreferences: {
            type: 'array',
            items: { type: 'object' },
            description: 'Lista de preferencias de comunicacao por canal e assunto.',
          },
          responsibles: {
            type: 'array',
            items: { $ref: '#/components/schemas/ResponsibleResponse' },
            description: 'Lista de responsaveis associados ao cliente. Para PF, tende a vir vazia.',
          },
          computed: {
            type: 'object',
            description: 'Campos calculados pela API a partir dos dados persistidos.',
            properties: {
              customerAge: {
                type: 'integer',
                nullable: true,
                description: 'Idade calculada a partir da data de nascimento da PF.',
              },
              companyAge: {
                type: 'integer',
                nullable: true,
                description: 'Idade da empresa calculada a partir da data de abertura.',
              },
              profitabilityAmount: {
                type: 'number',
                nullable: true,
                description: 'Valor calculado pela diferenca entre valor consumido e valor de custo.',
              },
              profitabilityPercentage: {
                type: 'number',
                nullable: true,
                description: 'Percentual calculado de lucratividade sobre o valor consumido.',
              },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de criacao do registro.',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da ultima atualizacao do registro.',
          },
        },
        required: ['id', 'personType', 'core', 'profile', 'contacts', 'emails', 'communicationPreferences', 'responsibles'],
      },
      ResponsibleResponse: {
        type: 'object',
        description: 'Representacao completa de um responsavel vinculado a cliente PJ.',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Identificador unico do responsavel.' },
          fullName: { type: 'string', description: 'Nome completo do responsavel.' },
          cpf: { type: 'string', nullable: true, description: 'CPF do responsavel, quando informado.' },
          rg: { type: 'string', nullable: true, description: 'RG do responsavel.' },
          nickname: { type: 'string', nullable: true, description: 'Apelido do responsavel.' },
          birthDate: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data de nascimento do responsavel.',
          },
          gender: { type: 'string', nullable: true, description: 'Genero informado no cadastro.' },
          familyRelationship: {
            type: 'string',
            nullable: true,
            description: 'Relacao familiar registrada no cadastro.',
          },
          role: { type: 'string', nullable: true, description: 'Cargo ou funcao do responsavel.' },
          profession: { type: 'string', nullable: true, description: 'Profissao do responsavel.' },
          driverLicenseExpiresAt: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Vencimento da CNH do responsavel, quando informado.',
          },
          active: {
            type: 'boolean',
            description: 'Indica se o responsavel esta ativo no relacionamento com o cliente.',
          },
          customerSince: {
            type: 'string',
            format: 'date',
            nullable: true,
            description: 'Data de inicio do relacionamento deste responsavel.',
          },
          referralSource: {
            type: 'string',
            nullable: true,
            description: 'Origem de captacao associada ao responsavel.',
          },
          referralName: {
            type: 'string',
            nullable: true,
            description: 'Nome do indicador associado ao responsavel.',
          },
          notes: {
            type: 'string',
            nullable: true,
            description: 'Observacoes livres sobre o responsavel.',
          },
          address: {
            oneOf: [{ $ref: '#/components/schemas/AddressInput' }, { type: 'null' }],
            description: 'Endereco principal do responsavel.',
          },
          contacts: {
            type: 'array',
            items: { type: 'object' },
            description: 'Lista de contatos do responsavel.',
          },
          emails: {
            type: 'array',
            items: { type: 'object' },
            description: 'Lista de e-mails do responsavel.',
          },
          computed: {
            type: 'object',
            description: 'Campos calculados pela API para o responsavel.',
            properties: {
              age: {
                type: 'integer',
                nullable: true,
                description: 'Idade calculada a partir da data de nascimento.',
              },
            },
          },
        },
        required: ['id', 'fullName', 'active', 'contacts', 'emails', 'computed'],
      },
      PaginatedCustomersResponse: {
        type: 'object',
        description: 'Resposta padrao de listagem paginada de clientes.',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CustomerResponse' },
            description: 'Lista de clientes retornados na pagina atual.',
          },
          total: { type: 'integer', description: 'Quantidade total de registros encontrados.' },
          page: { type: 'integer', description: 'Pagina atual retornada.' },
          limit: { type: 'integer', description: 'Quantidade maxima de itens por pagina.' },
        },
        required: ['items', 'total', 'page', 'limit'],
      },
      CustomerSearchResult: {
        type: 'object',
        description:
          'Resultado resumido da busca por cliente usado para preenchimento do campo de indicacao no frontend.',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Identificador unico do cliente encontrado.' },
          personType: {
            type: 'string',
            enum: ['INDIVIDUAL', 'COMPANY'],
            description: 'Tipo do cadastro encontrado.',
          },
          document: {
            type: 'string',
            nullable: true,
            description: 'CPF ou CNPJ do cliente encontrado.',
          },
          name: {
            type: 'string',
            nullable: true,
            description: 'Nome principal do cliente: nome completo para PF ou razao social para PJ.',
          },
          tradeName: {
            type: 'string',
            nullable: true,
            description: 'Nome fantasia quando o cliente for PJ.',
          },
        },
        required: ['id', 'personType'],
      },
      FormMetadataResponse: {
        type: 'object',
        description:
          'Metadados usados pelo frontend para padronizar obrigatoriedade, importancia e comportamento dos campos do formulario.',
        properties: {
          formKey: {
            type: 'string',
            description: 'Identificador estavel do formulario configurado.',
          },
          entity: {
            type: 'string',
            description: 'Identificador do formulario ou entidade referenciada pelos metadados.',
          },
          version: {
            type: 'string',
            description: 'Versao da configuracao de formulario para controle de evolucao.',
          },
          scope: {
            type: 'object',
            description: 'Escopo aplicado no filtro da configuracao, como o tipo de pessoa.',
            properties: {
              personType: {
                type: 'string',
                nullable: true,
                description: 'Tipo de pessoa usado para filtrar os campos retornados.',
              },
            },
          },
          sections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: { type: 'string', description: 'Chave tecnica da secao do formulario.' },
                label: { type: 'string', description: 'Titulo exibivel da secao.' },
                description: {
                  type: 'string',
                  description: 'Explica o objetivo da secao dentro do formulario.',
                },
                order: {
                  type: 'integer',
                  description: 'Ordem de exibicao da secao no frontend.',
                },
              },
              required: ['key', 'label', 'description', 'order'],
            },
            description: 'Lista de secoes que compoem o formulario.',
          },
          fields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fieldKey: {
                  type: 'string',
                  description: 'Chave tecnica do campo, usada para mapear a estrutura do payload.',
                },
                label: { type: 'string', description: 'Nome amigavel do campo para exibicao.' },
                section: {
                  type: 'string',
                  description: 'Secao do formulario em que o campo deve ser apresentado.',
                },
                required: {
                  type: 'boolean',
                  description: 'Define se o campo e obrigatorio para validacao.',
                },
                importance: {
                  type: 'string',
                  description: 'Nivel de importancia visual do campo, sem significar obrigatoriedade.',
                },
                inputType: {
                  type: 'string',
                  description: 'Tipo de componente ou entrada esperado para o campo.',
                },
                dataType: {
                  type: 'string',
                  description: 'Tipo de dado esperado pela API para o campo.',
                },
                visibleWhen: {
                  description: 'Regra condicional que define quando o campo deve ficar visivel.',
                },
                multiple: {
                  type: 'boolean',
                  description: 'Indica se o campo aceita colecao de valores.',
                },
                computed: {
                  type: 'boolean',
                  description: 'Indica se o campo e calculado pela API em vez de ser preenchido pelo usuario.',
                },
                readOnly: {
                  type: 'boolean',
                  description: 'Indica se o frontend deve tratar o campo como somente leitura.',
                },
                order: {
                  type: 'integer',
                  description: 'Ordem de exibicao do campo dentro da secao.',
                },
                description: {
                  type: 'string',
                  description: 'Explicacao funcional do que o campo representa.',
                },
                businessImpact: {
                  type: 'string',
                  description: 'Explica como o campo impacta regras, calculos ou comportamento do sistema.',
                },
                placeholder: {
                  type: 'string',
                  nullable: true,
                  description: 'Texto sugerido para exibicao no input, quando aplicavel.',
                },
                mask: {
                  type: 'string',
                  nullable: true,
                  description: 'Mascara sugerida para o frontend, quando o campo representar documento ou CEP.',
                },
                optionsSource: {
                  type: 'string',
                  nullable: true,
                  description: 'Origem sugerida para opcoes de campos selecionaveis.',
                },
              },
              required: [
                'fieldKey',
                'label',
                'section',
                'required',
                'importance',
                'inputType',
                'dataType',
                'multiple',
                'computed',
                'readOnly',
                'order',
                'description',
                'businessImpact',
              ],
            },
            description: 'Lista de campos e seus metadados comportamentais.',
          },
          groupedFields: {
            type: 'array',
            description: 'Campos agrupados por secao para facilitar consumo direto pelo frontend.',
            items: {
              type: 'object',
              properties: {
                section: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    label: { type: 'string' },
                    description: { type: 'string' },
                    order: { type: 'integer' },
                  },
                  required: ['key', 'label', 'description', 'order'],
                },
                fields: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              },
              required: ['section', 'fields'],
            },
          },
        },
        required: ['formKey', 'entity', 'version', 'sections', 'fields'],
      },
      UpdateFormFieldConfigRequest: {
        type: 'object',
        description:
          'Payload parcial para atualizar a configuracao de um campo do formulario de clientes.',
        properties: {
          label: {
            type: 'string',
            description: 'Novo rotulo amigavel exibido para o campo.',
          },
          section: {
            type: 'string',
            description: 'Nova secao em que o campo deve ser exibido.',
          },
          required: {
            type: 'boolean',
            description: 'Define se o campo passa a ser obrigatorio para validacao.',
          },
          importance: {
            type: 'string',
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            description: 'Nivel de importancia visual do campo no formulario.',
          },
          inputType: {
            type: 'string',
            enum: ['text', 'textarea', 'select', 'date', 'document', 'currency', 'number', 'boolean', 'collection'],
            description: 'Tipo de componente esperado no frontend.',
          },
          dataType: {
            type: 'string',
            enum: ['string', 'number', 'boolean', 'date', 'object', 'array'],
            description: 'Tipo de dado esperado pela API.',
          },
          multiple: {
            type: 'boolean',
            description: 'Indica se o campo aceita colecao de valores.',
          },
          computed: {
            type: 'boolean',
            description: 'Indica se o campo deve ser tratado como calculado.',
          },
          readOnly: {
            type: 'boolean',
            description: 'Indica se o campo deve ser exibido apenas para leitura.',
          },
          order: {
            type: 'integer',
            description: 'Nova ordem de exibicao do campo.',
          },
          visibleWhen: {
            type: 'object',
            nullable: true,
            description: 'Regra condicional de visibilidade do campo.',
            properties: {
              personType: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['INDIVIDUAL', 'COMPANY'],
                },
                description: 'Lista de tipos de pessoa para os quais o campo fica visivel.',
              },
            },
          },
          description: {
            type: 'string',
            description: 'Descricao funcional do campo.',
          },
          businessImpact: {
            type: 'string',
            description: 'Explica o impacto do campo nas regras ou comportamento do sistema.',
          },
          placeholder: {
            type: 'string',
            nullable: true,
            description: 'Placeholder sugerido para o componente no frontend.',
          },
          mask: {
            type: 'string',
            nullable: true,
            description: 'Mascara sugerida para o campo, quando aplicavel.',
          },
          optionsSource: {
            type: 'string',
            nullable: true,
            description: 'Origem das opcoes para campos selecionaveis.',
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verificar o estado da aplicacao',
        responses: {
          '200': {
            description: 'Aplicacao operacional',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autenticar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          '401': {
            description: 'Credenciais invalidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Renovar sessao',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshSessionRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Sessao renovada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RefreshSessionResponse' },
              },
            },
          },
          '401': {
            description: 'Refresh token invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Obter usuario autenticado',
        security: [bearerSecurityScheme],
        responses: {
          '200': {
            description: 'Usuario autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthUser' },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/customers': {
      post: {
        tags: ['Customers'],
        summary: 'Criar cliente PF ou PJ',
        security: [bearerSecurityScheme],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/CreateIndividualCustomerRequest' },
                  { $ref: '#/components/schemas/CreateCompanyCustomerRequest' },
                ],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Cliente criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CustomerResponse' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      get: {
        tags: ['Customers'],
        summary: 'Listar clientes paginados',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Lista paginada de clientes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedCustomersResponse' },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/customers/search': {
      get: {
        tags: ['Customers'],
        summary: 'Buscar clientes por nome, CPF ou CNPJ',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Resultados da busca',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CustomerSearchResult' },
                },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/customers/{customerId}': {
      get: {
        tags: ['Customers'],
        summary: 'Obter cliente por id',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Cliente encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CustomerResponse' },
              },
            },
          },
          '404': {
            description: 'Cliente nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Customers'],
        summary: 'Atualizar cliente',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCustomerRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Cliente atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CustomerResponse' },
              },
            },
          },
          '400': {
            description: 'Payload invalido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Cliente nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Customers'],
        summary: 'Remover cliente',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': {
            description: 'Cliente removido',
          },
          '404': {
            description: 'Cliente nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/customers/{customerId}/responsibles': {
      get: {
        tags: ['Responsibles'],
        summary: 'Listar responsaveis do cliente',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Lista de responsaveis',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ResponsibleResponse' },
                },
              },
            },
          },
          '404': {
            description: 'Cliente nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Responsibles'],
        summary: 'Adicionar responsavel ao cliente PJ',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResponsibleInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Responsavel criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ResponsibleResponse' },
              },
            },
          },
          '400': {
            description: 'Operacao invalida para cliente nao PJ',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/customers/{customerId}/responsibles/{responsibleId}': {
      get: {
        tags: ['Responsibles'],
        summary: 'Obter responsavel por id',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'responsibleId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Responsavel encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ResponsibleResponse' },
              },
            },
          },
          '404': {
            description: 'Responsavel nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Responsibles'],
        summary: 'Atualizar responsavel',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'responsibleId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                allOf: [{ $ref: '#/components/schemas/ResponsibleInput' }],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Responsavel atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ResponsibleResponse' },
              },
            },
          },
          '404': {
            description: 'Responsavel nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Responsibles'],
        summary: 'Remover responsavel',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'customerId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'responsibleId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '204': {
            description: 'Responsavel removido',
          },
          '400': {
            description: 'Tentativa de remover o ultimo responsavel de um cliente PJ',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Responsavel nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/form-metadata/customers': {
      get: {
        tags: ['Form Metadata'],
        summary: 'Obter metadados do formulario de clientes',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'personType',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['INDIVIDUAL', 'COMPANY'] },
            description: 'Filtra os campos retornados para um tipo de pessoa especifico.',
          },
        ],
        responses: {
          '200': {
            description: 'Metadados do formulario',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FormMetadataResponse' },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/form-metadata/customers/fields': {
      get: {
        tags: ['Form Metadata'],
        summary: 'Obter configuracao detalhada dos campos do formulario de clientes',
        description:
          'Retorna as configuracoes de exibicao, obrigatoriedade, importancia, descricoes funcionais e impacto de negocio dos campos do formulario de clientes.',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'personType',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['INDIVIDUAL', 'COMPANY'] },
            description: 'Filtra os campos retornados para pessoa fisica ou juridica.',
          },
        ],
        responses: {
          '200': {
            description: 'Configuracao detalhada dos campos do formulario de clientes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FormMetadataResponse' },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/form-metadata/customers/fields/{fieldKey}': {
      patch: {
        tags: ['Form Metadata'],
        summary: 'Atualizar configuracao de um campo do formulario de clientes',
        description:
          'Atualiza a configuracao persistida de um campo especifico do formulario de clientes, incluindo obrigatoriedade, importancia, descricao e comportamento de exibicao.',
        security: [bearerSecurityScheme],
        parameters: [
          {
            name: 'fieldKey',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Chave tecnica do campo que sera atualizado, por exemplo `profile.cpf`.',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateFormFieldConfigRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Configuracao do formulario atualizada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FormMetadataResponse' },
              },
            },
          },
          '400': {
            description: 'Payload invalido ou secao de destino inexistente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Campo de formulario nao encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/form-metadata/responsibles': {
      get: {
        tags: ['Form Metadata'],
        summary: 'Obter metadados do formulario de responsaveis',
        security: [bearerSecurityScheme],
        responses: {
          '200': {
            description: 'Metadados do formulario',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FormMetadataResponse' },
              },
            },
          },
          '401': {
            description: 'Nao autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/openapi.json': {
      get: {
        tags: ['Documentation'],
        summary: 'Obter especificacao OpenAPI em JSON',
        responses: {
          '200': {
            description: 'Especificacao da API',
          },
        },
      },
    },
    '/docs': {
      get: {
        tags: ['Documentation'],
        summary: 'Visualizar documentacao interativa com Scalar',
        responses: {
          '200': {
            description: 'Pagina HTML da documentacao',
          },
        },
      },
    },
  },
} as unknown as OpenAPIObject;
