# Contrato entre o app Nexus e a API

O app Expo é o front-end. A API deve ser executada e implantada como um serviço
independente; não coloque lógica que dependa de segredos ou do modelo de previsão
dentro do aplicativo.

## Configuração do front-end

Copie `.env.example` para `.env` e configure `EXPO_PUBLIC_API_URL` com a origem
do backend, sem incluir o caminho do endpoint. Use HTTPS fora do desenvolvimento.
Em um aparelho físico durante o desenvolvimento, use o IP local da máquina que
executa a API, acessível pela mesma rede.

```dotenv
EXPO_PUBLIC_API_URL=https://api.exemplo.com
EXPO_PUBLIC_USAR_MOCK=false
```

As variáveis `EXPO_PUBLIC_*` são públicas e incorporadas ao bundle. Nunca inclua
senhas, tokens privados ou chaves de serviços nessas variáveis. Reinicie o Expo
depois de alterar o `.env`.

## Obter previsão

```http
GET /api/previsao?horario=2026-10-03T15%3A00%3A00.000Z
Accept: application/json
```

`horario` é uma data ISO 8601 em UTC. Resposta de sucesso (`200`):

```json
{
  "modeloUsado": "Modelo C",
  "qualidade": "Boa",
  "latencia": 18.4,
  "perdaPacotes": 0.4,
  "distanciaProbe": 46.3
}
```

- `qualidade`: nível reconhecido pelo app, como `Boa`, `Moderada` ou `Instável`.
- `latencia`: número não negativo, em milissegundos.
- `perdaPacotes`: número entre 0 e 100, em percentual.
- `distanciaProbe`: número não negativo, em quilômetros; pode ser omitido ou `null`.
- `modeloUsado`: identificador legível do modelo; pode ser omitido.

Use códigos HTTP de erro apropriados para falhas. O endpoint deve validar a data,
aplicar limites de requisição e não expor dados pessoais desnecessários. Se o app
for acessado pela web, configure CORS para as origens necessárias; CORS não
substitui autenticação nem autorização no servidor.
