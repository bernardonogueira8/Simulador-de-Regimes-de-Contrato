### 1. Stack Tecnológico (100% Front-end)

Como o objetivo é alta reatividade e ausência de backend, a stack precisa focar em gerenciamento de estado local e renderização rápida:

* **Framework:** React com Vite (para build ultrarrápido) e TypeScript (essencial para garantir que a matemática dos impostos não quebre com tipagem)
* **Estilização:** Tailwind CSS para criar os cards comparativos e os sliders (controles deslizantes) de forma responsiva.
* **Hospedagem (Gratuita):** Netlify

### 2. Lógica de Cálculo no Navegador (O "Motor" Local)

As regras fiscais não ficarão em um banco de dados, mas sim em **arquivos de constantes estáticas** (`constants/tax-tables.ts`). Isso facilita a atualização quando a Receita Federal mudar as regras.

A lógica comparativa (o "pulo do gato" da Contabilizei) baseia-se em calcular o **Rendimento Líquido Real**.

#### A. Módulo CLT

* **Entrada:** Salário Bruto.
* **Descontos Matemáticos:** INSS (cálculo progressivo por faixas) e IRPF (desconto simplificado de R$ 528 ou deduções legais).
* **Acréscimos (Ocultos):** Adicionar matematicamente o FGTS (8%), 13º salário (divido por 12) e 1/3 de férias (dividido por 12) ao "pacote anual", pois isso é dinheiro que pertence ao trabalhador.

#### B. Módulo PJ (MEI / ME)

* **Custos Mensais Subtraídos:** DAS (se MEI, valor fixo; se ME Simples Nacional Anexo III/V, aplicar alíquota sobre faturamento) e Custo médio de contabilidade.
* **Reserva de Segurança (Cálculo Inverso):** Para a comparação ser justa com a CLT, o algoritmo deve deduzir do líquido da PJ uma "provisão" mensal para férias e 13º. O sistema mostrará: *"Valor líquido disponível para saque após você guardar seu próprio 13º e férias"*.

#### C. Módulo Bolsista (A Ponte Academia-Mercado)

Para comparar de forma justa uma bolsa de pesquisa (comum em mestrados e projetos de extensão) com propostas do mercado corporativo, o cálculo exige equalização:

* **Impostos:** Renda 100% isenta (cravado no código).
* **Desconto de Equalização:** O sistema deve ter um toggle (interruptor): *"Equiparar segurança previdenciária"*. Se ativado, o script subtrai 11% (ou 20%) do salário mínimo referente ao recolhimento do INSS como Contribuinte Facultativo, além de deduzir uma reserva matemática para meses sem remuneração (já que bolsistas não têm férias remuneradas ou 13º).

---

### 3. Design da Interface (Foco em Conversão e Clareza)

A interface deve seguir um painel único, similar a um dashboard de *Business Intelligence*, sem redirecionamentos de página.

1. **Header Interativo:** Um grande campo central: "Qual é a sua remuneração mensal base ou bolsa atual?" (Input de número grande).
2. **Painel de Configurações Laterais (Filtros):**
* Quantidade de dependentes.
* Desconto de VR/VA (CLT).
* Inclusão de custos extras de PJ (Ex: "Pago R$ 150 de internet para trabalhar").


3. **Cards Lado a Lado (Comparativo):**
* Três colunas grandes: **CLT | PJ | Bolsista**.
* Dentro de cada coluna, um visual de funil ou diagrama em cascata (Bruto -> Impostos/Custos -> Provisões -> **Líquido Real no Bolso**).
* Uso de cores contrastantes (ex: verde para o regime que está rendendo mais dinheiro líquido com os parâmetros atuais).



### 4. Retenção de Dados e Compartilhamento (Sem Banco)

Como não há banco de dados, você pode usar dois recursos nativos do navegador para manter a utilidade da ferramenta:

* **Persistência Local:** Salvar os parâmetros do usuário no `localStorage`. Se ele fechar a aba por engano, ao voltar no site, os valores de salário e dependentes ainda estarão lá.
* **Deep Linking (URL State):** Toda vez que o usuário alterar um valor, a URL do site é atualizada.
* *Exemplo:* `[meusite.com/calculadora?bruto=8000&dependentes=1&regime=clt](https://meusite.com/calculadora?bruto=8000&dependentes=1&regime=clt)`
* Isso permite que o usuário copie o link e mande para um colega ou salve para si mesmo no Obsidian ou Notion, abrindo exatamente a mesma simulação no futuro.
