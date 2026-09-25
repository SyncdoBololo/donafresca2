# Donafresca — recriação visual

Abra `index.html` no navegador. O projeto é estático, com HTML, CSS e JavaScript, sem instalação ou etapa de compilação. Imagens e fontes são locais. Para publicar, envie o conteúdo desta pasta a uma hospedagem de sites estáticos.

## O que está pronto

- Composição inspirada na referência enviada: fotografia de salmão sobre gelo, menu sobre a imagem, títulos em azul-marinho e turquesa, três colunas centrais, peixes ilustrados, faixa fotográfica azul e bordas orgânicas.
- Conteúdo e identidade da Donafresca, usando o logotipo oficial fornecido em `MAYARA.pdf`.
- Composição própria para celular e tablet: hero em camadas, ações largas para toque, espécies em cartões, história com leitura e fotografia separadas, rodapé em blocos e menu móvel.
- Coreografia com GSAP: entrada do hero, revelação das seções, profundidade suave nas fotografias, transições dos seletores e dos produtos e abertura dos diálogos. A preferência de movimento reduzido é respeitada por padrão e pode ser alterada no rodapé do próprio site.
- Seletores de destaques e de espécies.
- Catálogo com os 119 produtos publicados pela Donafresca, nove categorias, busca sem distinção de acentos, carregamento progressivo, quantidades e soma estimada do pedido.
- Link de WhatsApp com os itens selecionados, pronto para o visitante revisar e enviar. Não há envio automático, pagamento, controle de estoque ou backend.
- Janela de informações da loja com endereço, horários e link de mapas.

## Editar o conteúdo

- `index.html`: textos, endereço, contatos, horários e estrutura.
- `style.css`: cores, tipografia, tamanhos e responsividade.
- `catalog-data.js`: produtos, categorias, unidades, preços e caminhos das fotografias.
- `app.js`: seletores, filtros, busca, carregamento do catálogo e montagem do pedido.
- `motion.js`: coreografia e integração com GSAP/ScrollTrigger.
- `vendor/`: GSAP 3.15.0 e ScrollTrigger salvos localmente; o site não depende de CDN.
- `assets/`: fotografias, logotipo, divisória e artes tipográficas. A pasta `assets/products/` contém a cópia local das imagens do catálogo.

O endereço e o telefone foram fornecidos pela empresa. Produtos, categorias, unidades, preços e fotografias foram consultados em 24/09/2026 no catálogo público da Donafresca. Disponibilidade e valores podem mudar; o pedido preparado no site segue para confirmação pelo WhatsApp.

## Procedência visual

- Referência: imagem `download.jpeg` enviada pelo usuário e https://bp-trading.pl/.
- Tipografia dos textos e subtítulos: Arial Bold. Os títulos principais usam Coolvetica convertida em imagens PNG fixas, conforme permitido pela licença Desktop incluída no pacote fornecido. O arquivo da fonte não é distribuído com o site; os mesmos títulos permanecem no HTML como texto semântico para acessibilidade.
- Textura de divisão: site de referência; este pacote não concede licenças adicionais sobre materiais de terceiros.
- Fotografias principais `hero.webp` e `history.webp`: recriadas a partir da direção da referência enviada. Não são as fotografias originais do Pinterest.
- Logotipo: extraído do arquivo oficial `MAYARA.pdf` fornecido pelo usuário. Fotografias de produtos: catálogo público da Donafresca em https://donafresca-pescados.onbeef.app.br/.
- Peixes vetoriais e implementação: criados para esta versão.

## Verificação

Revisado visualmente em navegador Chromium/Edge nas larguras 1440, 768, 390 e 320 px, sem rolagem horizontal. Verificados: GSAP e ScrollTrigger locais, preferência por movimento reduzido, carregamento dos 119 produtos e suas imagens, menu móvel, seleção de espécies e destaques, filtros, busca com acentos, carregamento progressivo, estado sem resultados, soma de quantidades, conteúdo do link de WhatsApp e fechamento das janelas com Escape. Nenhum erro JavaScript ou resposta de asset com erro no percurso testado. Nenhuma mensagem ou pedido real foi enviado.

O layout para celular é uma adaptação: a referência fornecida mostra apenas a versão desktop. A página principal preserva a identidade e a ordem da composição, mas reorganiza os elementos para leitura, toque e uso com uma mão. O catálogo e a loja ocupam a tela inteira no celular.
