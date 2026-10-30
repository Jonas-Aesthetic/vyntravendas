# Vyntra · Painel de Vendas compartilhado

Agora os leads ficam salvos no Upstash Redis e todos que abrirem o link veem os mesmos dados (atualiza a cada 5 segundos).

## Colocar no ar
1. Suba esta pasta (index.html, api/, package.json) na raiz de um repositório do GitHub e importe na Vercel como novo projeto.
2. Na Vercel: Storage > selecione o banco Upstash que você já criou > Connect Project > escolha este projeto (deixe o prefixo em branco).
3. Deployments > Redeploy.

Atalho: se preferir usar o projeto placa-nfc (que já tem o Redis), copie index.html para public/vendas/index.html e api/leads.js para api/leads.js. O painel abre em /vendas.

## Observações
- O primeiro acesso importa os dados do navegador de quem abrir primeiro (ou cria os exemplos) e salva para todos.
- Qualquer pessoa com o link vê e edita os leads. Se precisar de senha, é possível acrescentar.
