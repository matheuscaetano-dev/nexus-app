# Contrato entre o app Nexus e a Internet Quality API

O app usa a API educacional hospedada em `https://internet-quality-api.onrender.com`.
Ela consulta previsões já calculadas; não executa os modelos nem consulta o RIPE
Atlas em tempo real. As classificações GOOD / MODERATE / UNSTABLE e as recomendações
são regras experimentais do protótipo.

## Configuração

Copie `.env.example` para `.env`. Para usar os dados simulados, mantenha
`EXPO_PUBLIC_USAR_MOCK=true`. Para consultar a API, use:

```dotenv
EXPO_PUBLIC_API_URL=https://internet-quality-api.onrender.com
EXPO_PUBLIC_USAR_MOCK=false
```

Reinicie o Expo depois de alterar o `.env`. Variáveis `EXPO_PUBLIC_*` são
incorporadas ao app; nunca coloque segredos nelas.

## Fluxo do app

1. `GET /api/v1/models` carrega `items`. O usuário escolhe um modelo; o app envia
   seu `id` (`model-a`, por exemplo) como `model_id` nas consultas.
2. `GET /api/v1/locations` carrega probes disponíveis. `probeId` identifica a
   probe e `location.latitude` / `location.longitude` são coordenadas públicas
   aproximadas, não a localização exata do usuário. A API não retorna IPs das probes.
3. `GET /api/v1/forecasts/nearby?lat=...&lon=...&model_id=...` retorna a previsão
   da probe disponível mais próxima para aquele modelo. O app lê qualidade em
   `assessment.quality`, métricas em `prediction` e distância em `matchedProbe`.
4. A linha do tempo usa
   `GET /api/v1/forecasts/probes/{probe_id}/timeline?model_id=...&from=...&to=...&limit=24`.
   `from` e `to` são instantes ISO 8601 em UTC e inclusivos.
5. O planejamento usa `POST /api/v1/activity/check` com JSON:

```json
{
  "modelId": "model-a",
  "latitude": -23.55,
  "longitude": -46.63,
  "dateTime": "2026-10-07T19:00:00Z",
  "activity": "VIDEO_CALL"
}
```

Atividades aceitas: `VIDEO_CALL`, `AUDIO_CALL`, `STREAMING`, `FILE_UPLOAD`,
`WEB_BROWSING` e `MESSAGING`. A resposta inclui `suitable`, `forecast` e
`recommendation`; a decisão de adequação é uma regra de negócio da API.

`GET /api/v1/health` pode ser usado para conferir se o serviço está ativo. Para
Expo Web, o servidor precisa permitir a origem do app por CORS. O app não precisa
de chave privada para os endpoints documentados.
