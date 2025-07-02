# Hydro Calculator Mobile (React Native Expo Version)

Este projeto é uma conversão do aplicativo web Hydro Calculator (originalmente em Next.js) para uma versão mobile utilizando React Native com Expo. O objetivo é fornecer as funcionalidades de cálculo hidráulico e aprendizado em dispositivos móveis iOS e Android.

## Visão Geral

O Hydro Calculator Mobile permite aos usuários realizar diversos cálculos hidráulicos, visualizar seu histórico de cálculos, e acessar módulos de aprendizado relacionados a cada tipo de cálculo.

## Estrutura do Projeto

O projeto está organizado da seguinte forma dentro da pasta `hydro-calculator-mobile/`:

```
hydro-calculator-mobile/
├── app/                     # Telas e configuração de rotas (expo-router)
│   ├── _layout.tsx          # Configuração principal do Stack Navigator
│   ├── index.tsx            # Tela inicial (SplashScreen)
│   ├── dashboard.tsx        # Tela do painel principal
│   ├── calculation/
│   │   └── [id].tsx         # Tela dinâmica para cálculos específicos
│   └── learning/
│       └── [id].tsx         # Tela dinâmica para módulos de aprendizado
├── assets/                  # Recursos estáticos
│   ├── icon.png             # Ícone do aplicativo
│   ├── splash.png           # Imagem da tela de splash
│   ├── adaptive-icon.png    # Ícone adaptativo para Android
│   └── favicon.png          # Favicon para a versão web (gerada pelo Expo)
├── components/              # Componentes React Native reutilizáveis
│   ├── SplashScreen.tsx     # Componente da tela de splash inicial
│   ├── Dashboard.tsx        # Componente de UI para o painel
│   ├── CalculationView.tsx  # Componente de UI para a tela de cálculo
│   └── LearningView.tsx     # Componente de UI para a tela de aprendizado
├── types/                   # Definições TypeScript globais
│   └── calculation.ts       # Tipos relacionados aos cálculos e histórico
├── .expo/                   # Arquivos gerados pelo Expo (ignorado pelo Git)
├── .gitignore               # Arquivos e pastas ignorados pelo Git
├── app.json                 # Configurações do aplicativo Expo
├── babel.config.js          # Configuração do Babel
├── package.json             # Dependências e scripts do projeto
├── tsconfig.json            # Configuração do TypeScript
└── README.md                # Este arquivo
```

**Pastas Principais:**

*   **`app/`**: Gerenciada pelo `expo-router`. Cada arquivo `.tsx` dentro desta pasta (e suas subpastas) define uma rota no aplicativo.
    *   `_layout.tsx`: Define o layout principal da navegação, geralmente o Stack Navigator.
    *   `index.tsx`: Ponto de entrada da navegação, geralmente a primeira tela visível.
    *   Telas nomeadas como `dashboard.tsx`, `calculation/[id].tsx` (rota dinâmica) e `learning/[id].tsx` (rota dinâmica).
*   **`assets/`**: Contém imagens e outros recursos estáticos. Os ícones principais da aplicação são gerenciados via `lucide-react-native`.
*   **`components/`**: Componentes de UI reutilizáveis que não são telas completas. Eles são importados pelas telas na pasta `app/`.
    *   *Nota:* Idealmente, componentes de UI muito genéricos (como botões, cards, inputs customizados adaptados de `shadcn/ui`) poderiam residir em `components/ui/` para melhor organização, mas devido à migração direta sem o código-fonte original dos componentes `shadcn/ui`, eles foram integrados ou substituídos por componentes React Native padrão estilizados dentro dos componentes de visualização maiores.
*   **`types/`**: Contém definições de tipo TypeScript usadas em todo o projeto.

**Arquivos de Configuração Chave:**

*   **`package.json`**: Lista as dependências do projeto (React, React Native, Expo, `expo-router`, `lucide-react-native`, `@react-native-async-storage/async-storage`, etc.) e os scripts (start, android, ios, web).
*   **`app.json`**: Arquivo de configuração específico do Expo, onde se define o nome do app, slug, versão, ícones, tela de splash, plugins, etc.
*   **`babel.config.js`**: Configuração do Babel, essencial para transpilar JavaScript/TypeScript moderno e para o funcionamento de plugins como o do `expo-router`.
*   **`tsconfig.json`**: Configuração do compilador TypeScript, definindo como o código TS é verificado e compilado.

## Principais Dependências Adicionadas

*   **`expo`**: Framework que facilita o desenvolvimento e build de apps React Native.
*   **`react` e `react-native`**: Bibliotecas base para a construção da UI e lógica.
*   **`expo-router`**: Para navegação baseada em sistema de arquivos, similar ao Next.js App Router. Simplifica a definição de rotas e a passagem de parâmetros.
*   **`@react-native-async-storage/async-storage`**: Para persistência de dados local no dispositivo, substituindo o `localStorage` da web.
*   **`lucide-react-native`**: Biblioteca de ícones SVG otimizada para React Native, usada para a maioria dos ícones da interface.

## Decisões de Arquitetura e Migração

*   **Navegação:**
    *   O sistema de `currentView` do app Next.js foi mapeado para um sistema de rotas usando `expo-router`.
    *   Telas principais (`dashboard`, `calculation`, `learning`) são arquivos em `app/`.
    *   Parâmetros de rota são usados para passar dados entre telas (ex: ID do cálculo).
    *   O `Stack.Navigator` do `expo-router` é usado para gerenciar a pilha de navegação e o header nativo.
*   **Gerenciamento de Estado:**
    *   O estado local dos componentes é gerenciado com `useState` e `useEffect`.
    *   Dados persistentes (histórico, módulos completos, streak) são armazenados usando `@react-native-async-storage/async-storage`.
    *   `useFocusEffect` é utilizado em telas como Dashboard e Learning para recarregar dados do AsyncStorage quando a tela ganha foco, garantindo que a UI reflita o estado mais recente.
    *   Para aplicações mais complexas, a introdução de um gerenciador de estado global (Context API, Zustand, Redux) seria um próximo passo lógico.
*   **Estilização:**
    *   Os estilos são definidos usando `StyleSheet.create` do React Native.
    *   Foi criada uma paleta de cores (`AppColors` em alguns componentes, e no `_layout.tsx`) para manter a consistência visual.
    *   A migração de TailwindCSS/shadcn/ui foi feita adaptando os conceitos para `StyleSheet`. Componentes `shadcn/ui` específicos não foram portados diretamente devido à ausência do código-fonte original no momento da migração e às diferenças inerentes entre web (HTML/CSS) e nativo. Em vez disso, componentes React Native equivalentes foram criados e estilizados.
*   **Ícones:**
    *   `lucide-react` foi substituído por `lucide-react-native`.
    *   Ícones de emoji no array `calculationsData` são renderizados diretamente em componentes `<Text>`.
*   **Persistência de Dados:**
    *   As seguintes chaves são usadas no AsyncStorage:
        *   `hydraulic-calc-history`: Armazena o array do histórico de cálculos.
        *   `hydraulic-learning-modules`: Armazena um array (serializado de um Set) dos IDs dos módulos de aprendizado concluídos.
        *   `hydraulic-streak`: Armazena o streak de cálculo atual.
        *   `hydraulic-last-calculation`: Armazena a data do último cálculo para a lógica do streak.

## Como Executar o Projeto

1.  **Pré-requisitos:**
    *   Node.js (LTS recomendado)
    *   npm ou Yarn
    *   Expo CLI: `npm install -g expo-cli`
    *   Git (para clonar o repositório, se aplicável)
    *   Emulador Android Studio / Xcode (para simulador iOS) ou um dispositivo físico com o app Expo Go.

2.  **Instalação:**
    ```bash
    # Navegue até a pasta hydro-calculator-mobile
    cd hydro-calculator-mobile

    # Instale as dependências
    npm install
    # ou
    yarn install
    ```

3.  **Executando o Aplicativo:**
    ```bash
    npx expo start
    ```
    Isso iniciará o Metro Bundler. Você verá um QR code no terminal.
    *   **Para rodar no seu dispositivo:** Instale o aplicativo "Expo Go" (Android/iOS) e escaneie o QR code.
    *   **Para rodar no emulador/simulador:**
        *   Pressione `a` no terminal para abrir no emulador Android (requer Android Studio configurado).
        *   Pressione `i` no terminal para abrir no simulador iOS (requer macOS e Xcode configurado).
        *   Pressione `w` para tentar abrir no navegador (funcionalidade web do Expo).

## Lógica de Cálculo

*   A lógica para cada tipo de cálculo está centralizada na função `performCalculation` dentro do arquivo `hydro-calculator-mobile/components/CalculationView.tsx`.
*   **Importante:** Atualmente, as fórmulas dentro de `performCalculation` são **placeholders ou exemplos simplificados**. Elas precisam ser revisadas e preenchidas com as fórmulas hidráulicas corretas e validadas do projeto original para garantir a precisão dos cálculos.
*   A função `getCalculationFields` no mesmo arquivo define os campos de entrada para cada tipo de cálculo.

## Limitações e Próximos Passos

*   **Componentes UI (Shadcn/UI):** A migração dos componentes `shadcn/ui` não foi uma tradução direta 1:1, pois são baseados em Radix UI e TailwindCSS, que têm paradigmas diferentes do React Native. Foram criados componentes React Native com funcionalidade e aparência similar, estilizados com `StyleSheet`. Uma revisão e refatoração mais profunda desses componentes pode ser necessária se uma fidelidade visual exata aos componentes web for um requisito.
*   **Testes:** O aplicativo requer testes extensivos em dispositivos iOS e Android reais para identificar e corrigir bugs específicos da plataforma, problemas de layout e de performance.
*   **Otimizações de Performance:**
    *   Investigar o uso de `React.memo`, `useCallback` de forma mais granular.
    *   Otimizar `FlatList`s com `initialNumToRender`, `windowSize`, e potencialmente `getItemLayout` se as alturas dos itens puderem ser fixadas ou calculadas.
    *   Considerar `expo-image` para melhor performance de carregamento de imagens.
*   **Gerenciamento de Estado Avançado:** Se a complexidade do estado compartilhado aumentar, considerar a implementação de uma biblioteca de gerenciamento de estado global (Zustand, Redux Toolkit, Jotai).
*   **Fórmulas de Cálculo:** **Prioridade máxima** é validar e implementar as fórmulas de cálculo corretas em `performCalculation`.
*   **Tratamento de Erro Avançado:** Melhorar o feedback ao usuário para erros (ex: toasts/snackbars em vez de `Alert`).
*   **Design Responsivo:** Embora o Flexbox ajude, testar e ajustar para diferentes tamanhos de tela e orientações.

---

Este README deve fornecer uma boa base para entender o projeto React Native migrado.
