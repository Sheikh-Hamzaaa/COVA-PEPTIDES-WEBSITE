from pathlib import Path
import json,shutil
root=Path('/workspace/sites/cova-boutique');src=Path('/workspace/scratch/749a6eb4c644/sources/cova-assets');dst=root/'dist/assets/products';dst.mkdir(exist_ok=True)
mapping={
'Retatrutide':'COVA retatrutide research vial mockup.png',
'Tirzepatide':'COVA Tirzepatide laboratory vial on ivory tabletop.png',
'Semaglutide':'COVA Semaglutide Vial with Orchid.png',
'Wolverine':'COVA Wolverine Research Vial Mockup.png',
'GLOW':'COVA Glow Research Vial.png',
'CJC-1295 + Ipamorelin':'COVA CJC-1295 + IPAMORELIN vial.png',
'Sermorelin':'Elegant COVA Sermorelin Vial Mockup.png',
'Tesamorelin':'COVA Tesamorelin 10 mg vial mockup.png',
'MOTS-c':'COVA MOTS-c 10 mg vial mockup.png',
'DSIP':'COVA DSIP Laboratory Vial Mockup.png',
'AOD-9604':'COVA AOD-9604 Research Vial Concept.png',
'NAD+':'COVA NAD+ Silver-Capped Vial Mockup.png',
'GHK-Cu':'COVA GHK-Cu research vial.png',
'BPC-157':'COVA BPC-157 Vial Packaging Concept.png'}
p=root/'dist/products.json';data=json.loads(p.read_text())
for i,item in enumerate(data):
 if item['name'] in mapping:
  f=src/mapping[item['name']];assert f.exists(),f
  dest=dst/f'cova-{i+1:02d}.png';shutil.copyfile(f,dest)
  item['graphic']='assets/products/'+dest.name
  item['graphic_alt']='COVA '+item['name']+' vial packaging concept'
p.write_text(json.dumps(data,ensure_ascii=False))
p=root/'dist/app.js';s=p.read_text();old='<article class="product"><span class="category">';new='<article class="product">${p.graphic?`<figure class="product-visual"><img src="${esc(p.graphic)}" alt="${esc(p.graphic_alt)}" loading="lazy" width="1448" height="1086"><figcaption>Packaging concept · confirmed specifications accompany your quote</figcaption></figure>`:""}<span class="category">';assert old in s;s=s.replace(old,new);p.write_text(s)
p=root/'dist/index.html';s=p.read_text();old='</div></section>\n<section class="brand section">';new='</div></section>\n<div class="gold-ribbon"><span>COVA PEP</span><span>SCIENCE • BEAUTY • VITALITY</span><span>EXCLUSIVE BOUTIQUE COLLECTION</span></div>\n<section class="brand section">';assert old in s;s=s.replace(old,new);p.write_text(s)
print('Mapped',sum('graphic' in x for x in data),'of',len(data),'product families')
print('Not located:',', '.join(x['name'] for x in data if 'graphic' not in x))
