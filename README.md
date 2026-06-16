# WallFixTV.pt

Site institucional de montagem de TV na parede, suportes fixos/articulados, organização de cabos e instalação em pladur, tijolo e betão.

**Domínio:** https://www.wallfixtv.pt/  
**WhatsApp:** +351 932 504 112

## Descrição do projeto

Site estático, responsivo e otimizado para SEO local, focado em converter visitantes em contactos por WhatsApp ou pedidos de agendamento através do popup integrado.

## Estrutura de ficheiros

```
index.html          # Página principal
styles.css          # Estilos e layout responsivo
script.js           # Menu mobile, navegação ativa e popup de agendamento
robots.txt          # Instruções para motores de busca
sitemap.xml         # Mapa do site
CNAME               # www.wallfixtv.pt
README.md
package.json        # Script local de exportação para revisão
scripts/
  export-review-code.js
  optimize-assets.ps1
assets/
  images/           # Hero, galeria e imagem OG
  icons/            # Ícones de serviços e processo
  logos/            # Logótipo
```

## SEO aplicado

- Title, meta description e canonical
- Open Graph e Twitter Cards com imagem OG dedicada
- H1 e copy otimizados para montagem de TV na parede
- Secções de serviços, zonas, FAQ e conteúdo de confiança
- Schema `LocalBusiness` (sem reviews inventadas)
- Schema `FAQPage`
- `robots.txt` e `sitemap.xml`
- Alt text descritivo nas imagens
- `loading="lazy"` fora do hero; `fetchpriority="high"` no hero
- Imagens WebP para hero e galeria; OG em JPG para compatibilidade social

## Popup de agendamento

O botão **Agendar montagem da TV** abre um formulário com validação. Ao submeter, os dados são enviados para o WhatsApp (`+351 932 504 112`) com mensagem pré-formatada.

## Notas importantes

- **Não colocar preços** no site sem estratégia comercial definida
- **Não inventar reviews** nem depoimentos falsos
- **Não usar links mortos** (`href="#"`) — redes sociais só quando existirem URLs reais
- Substituir imagens de galeria por fotos reais dos trabalhos quando disponíveis

## Performance

- Hero em WebP (~58 KB)
- Galeria em WebP (~7–10 KB por imagem)
- Logo otimizado em PNG (~158 KB)
- OG em JPG (~99 KB)
- CSS e JS nativos, sem frameworks pesados

## Próximos passos recomendados

1. Adicionar fotos reais dos trabalhos na galeria
2. Criar e otimizar Google Business Profile
3. Pedir reviews reais a clientes satisfeitos (só publicar depois de existirem)
4. Submeter `sitemap.xml` no Google Search Console
5. Criar páginas locais com conteúdo único (não copypaste), por exemplo:
   - `/montagem-tv-lisboa/`
   - `/montagem-tv-odivelas/`
   - `/montagem-tv-amadora/`
   - `/montagem-tv-sintra/`
   - `/montagem-tv-cascais/`
   - `/montagem-tv-almada/`
   - `/montagem-tv-seixal/`

## Exportação local para revisão

```bash
npm run export:review
```

Gera `review-export/CODIGO_COMPLETO_WALLFIXTV_REVIEW.md` (pasta ignorada pelo Git).
