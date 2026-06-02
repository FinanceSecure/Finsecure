# Checklist Mobile para Beta/Deploy

## Ambiente

- [ ] Definir `EXPO_PUBLIC_API_URL` com URL HTTPS da API em staging/produção.
- [ ] Confirmar que nenhuma variável `EXPO_PUBLIC_*` contém segredo.
- [ ] Validar `.env.example` com apenas variáveis públicas.
- [ ] Confirmar `app.json`: nome, slug, versão, `android.package` e `ios.bundleIdentifier`.
- [ ] Confirmar ícone, adaptive icon e splash com a identidade Midnight Capital.

## Segurança

- [ ] Android/iOS usam `expo-secure-store` para o JWT.
- [ ] Web não usa `localStorage` para JWT.
- [ ] Produção web deve migrar para cookie `HttpOnly`, `Secure` e `SameSite`.
- [ ] Logout limpa token local, usuário em memória e cache do React Query.
- [ ] Excluir conta limpa sessão local após confirmação.
- [ ] Não há `console.log` com token, headers, payloads ou dados financeiros.
- [ ] Erros 401, 403, 422, 429 e 500 exibem mensagens seguras ao usuário.

## API

- [ ] Backend responde no envelope `{ success, message, data }` para sucesso.
- [ ] Backend responde `{ success, message, error }` para erro.
- [ ] Rotas privadas rejeitam token inválido ou expirado com 401.
- [ ] CORS aceita apenas origens esperadas do app/web.
- [ ] `/health` da API está disponível para monitoramento.

## UX e Fluxos

- [ ] Login: e-mail válido, senha obrigatória, loading e erro amigável.
- [ ] Registro: confirmação de senha e aceite de termos obrigatórios.
- [ ] Dashboard: loading, erro e vazio testados com API indisponível e usuário novo.
- [ ] Nova transação: valor, categoria, data e descrição validados.
- [ ] Investimentos: aplicação e resgate atualizam carteira e dashboard.
- [ ] Perfil: logout, alteração de dados e exclusão exigem confirmação quando crítico.
- [ ] Consultor IA aparece apenas como estrutura futura, sem prometer recomendação profissional.

## Build

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] `npm audit`
- [ ] `npm outdated`
- [ ] `npx expo-doctor`
- [ ] `npx expo export --platform android`
- [ ] `npx expo export --platform web`
- [ ] `npx eas-cli build --platform android --profile preview`

## Antes de Publicar

- [ ] Substituir texto placeholder da política de privacidade por texto aprovado.
- [ ] Confirmar termos de uso e política de exclusão de conta.
- [ ] Revisar permissões nativas e remover qualquer permissão desnecessária.
- [ ] Testar em dispositivo físico Android.
- [ ] Testar sessão expirada e queda de internet.
- [ ] Validar LGPD: sem coleta excessiva, sem logs sensíveis, sem envio externo desnecessário.
