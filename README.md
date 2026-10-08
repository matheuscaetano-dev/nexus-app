# Nexus

Aplicativo móvel educacional para consultar estimativas de qualidade da conexão por região e período. O Nexus usa uma API que disponibiliza previsões já calculadas; os resultados são referências aproximadas e não medições diretas da internet do aparelho.

## O que o app oferece

- Escolha entre modelos de previsão disponíveis na API.
- Selecione uma probe pública como referência regional. As coordenadas da probe são aproximadas e não indicam o endereço exato da pessoa usuária.
- Consulte a previsão atual, a linha do tempo disponível e a estimativa para atividades como chamadas, streaming e navegação.
- Veja explicações sobre as métricas e use os ajustes de acessibilidade do app.

As categorias de qualidade e as recomendações são experimentais. A API lê previsões existentes na base; ela não executa os modelos nem consulta o RIPE Atlas em tempo real. Por isso, pode não haver previsão para a data ou período selecionado.

## Tecnologias

- Expo e React Native
- React Navigation
- Internet Quality API

## Executar o projeto

Instale uma versão atual do Node.js e, na pasta do projeto, instale as dependências:

```bash
npm install
```

Crie o arquivo local de configuração a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

No macOS ou Linux, use `cp .env.example .env`. Depois, escolha um dos modos abaixo e inicie o Expo:

```bash
npm start
```

Abra o QR code com o Expo Go no celular. O computador e o celular precisam conseguir se comunicar pela rede. Também é possível iniciar diretamente com `npm run android`, `npm run ios` ou `npm run web`, conforme o ambiente disponível.

### Usar dados simulados

No `.env`, configure:

```dotenv
EXPO_PUBLIC_USAR_MOCK=true
```

Esse modo permite navegar com dados de demonstração sem depender da API.

### Conectar à API

No `.env`, configure o endereço da API e desative os dados simulados:

```dotenv
EXPO_PUBLIC_API_URL=https://internet-quality-api.onrender.com
EXPO_PUBLIC_USAR_MOCK=false
```

Reinicie o Expo após alterar o `.env`. Variáveis `EXPO_PUBLIC_*` são incorporadas ao aplicativo; não coloque nelas senhas, tokens privados ou chaves secretas. Para abrir a API e conferir os endpoints, acesse a [documentação Swagger](https://internet-quality-api.onrender.com/docs).

## Endpoints usados

| Endpoint | Uso no app |
| --- | --- |
| `GET /api/v1/health` | Verificar se o serviço está ativo. |
| `GET /api/v1/models` | Carregar os modelos disponíveis para escolha. O `id` selecionado é enviado nas consultas. |
| `GET /api/v1/locations` | Listar probes com previsões disponíveis e suas coordenadas públicas aproximadas. |
| `GET /api/v1/forecasts/nearby` | Consultar a previsão da probe disponível mais próxima. |
| `GET /api/v1/forecasts/probes/{probe_id}/timeline` | Buscar previsões da probe em um intervalo de datas. |
| `POST /api/v1/activity/check` | Obter a previsão e a recomendação para uma atividade e horário. |

Os parâmetros e exemplos completos estão em [`docs/contrato-api.md`](docs/contrato-api.md).

## Organização do código

```text
src/
  components/    Componentes reutilizáveis da interface
  context/       Estado compartilhado de conexão e acessibilidade
  domain/        Regras e dados de domínio
  hooks/         Hooks reutilizáveis
  navigation/    Navegação por abas e telas
  screens/       Telas do aplicativo
  services/      Comunicação com a API e dados simulados
  theme/         Cores, tipografia, espaçamentos e formas
  utils/         Formatação e funções auxiliares
docs/
  contrato-api.md Contrato entre o app e a API
```

## Observações

- A disponibilidade da previsão depende das datas presentes na API. Uma resposta sem registros para o período escolhido não significa necessariamente que o app esteja com erro.
- A API hospedada pode levar alguns segundos para responder após um período sem uso.
- No Expo Web, a API precisa permitir a origem do app por CORS.
- O app não recebe os endereços IP das probes. A referência regional não deve ser apresentada como localização exata da pessoa usuária.
