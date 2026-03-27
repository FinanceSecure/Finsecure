# 📱 Finsecure

O Finsecure é um aplicativo mobile desenvolvido com Expo focado em segurança financeira e gestão de dados. Este projeto utiliza roteamento baseado em arquivos e as melhores práticas do ecossistema React Native.
🚀 Como Começar
Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js (LTS recomendado)
- npm ou yarn
- Android Studio (configurado para desenvolvimento Android)
- Java JDK instalado e as variáveis de ambiente (ANDROID_HOME) configuradas.

## 1. Instalação de Dependências

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

## 2. Iniciando o App

Para subir o servidor de desenvolvimento do Expo:

```bash
npx expo start
```

🛠️ Opções de Visualização

Após iniciar o servidor, você pode abrir o app de diferentes formas:
-   Emulador Android: Pressione a no terminal (requer o Android Studio aberto).
-   Dispositivo Físico (Expo Go): Escaneie o QR Code gerado no terminal usando o app Expo Go no seu celular.
-   iOS Simulator: Pressione i (disponível apenas em macOS).

📂 Estrutura do Projeto

Este projeto utiliza Expo Router (file-based routing):

    app/: Contém as telas e rotas principais do aplicativo.

    components/: Componentes reutilizáveis de interface.

    assets/: Imagens, fontes e ícones utilizados.

🧹 Resetando o Projeto

Se desejar limpar o código de exemplo e começar do zero:

```bash
npm run reset-project
```

Isso moverá o código inicial para app-example/ e criará uma pasta app/ vazia.