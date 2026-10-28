import json
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
root=Path(__file__).parent
pdfmetrics.registerFont(TTFont('DV','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'));pdfmetrics.registerFont(TTFont('DVB','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
W,H=595.28,841.89;out=root/'dist/assets/COVA_Collection_One_Sheet.pdf';c=canvas.Canvas(str(out),pagesize=(W,H));c.setTitle('COVA PEP | Science • Beauty • Vitality')
c.setFillColor(HexColor('#F8F5EE'));c.rect(0,0,W,H,fill=1,stroke=0)
def text(x,y,t,size=8,font='DV',color='#342D25'):
 c.setFillColor(HexColor(color));c.setFont(font,size);c.drawString(x,y,t)
def para(x,y,t,width,size=7.4):
 p=Paragraph(t,ParagraphStyle('p',fontName='DV',fontSize=size,leading=size*1.35,textColor=HexColor('#655B4F')));_,h=p.wrap(width,200);p.drawOn(c,x,y-h);return h
# Crop in layout to use the supplied logo with the new tagline.
c.saveState();path=c.beginPath();path.rect(35,744,210,38);c.clipPath(path,stroke=0);c.drawImage(str(root/'dist/assets/cova-logo.jpg'),35,722,width=210,height=70);c.restoreState()
text(35,729,'Science • Beauty • Vitality',8,'DV','#91703E')
text(325,777,'EXCLUSIVE BOUTIQUE COLLECTION',7,'DVB','#91703E')
text(325,760,'Inspired by HRH Coco Accom',8)
text(35,699,'Discover the COVA collection.',24)
para(35,684,'24 product families. A concise guide to the biological pathways and potential applications behind each selection.',525,8)
items=json.loads((root/'dist/products.json').read_text())
shorts=[
'Triple-receptor metabolic peptide; human trials evaluate weight management and glucose control.',
'Dual GIP/GLP-1 activity; clinical metabolic benefits relate to specific prescription formulations.',
'GLP-1 activity associated with appetite and glucose regulation in clinical prescription-product studies.',
'BPC-157/TB-500 blend concept focused on tissue-response pathways. Confirm the written formulation.',
'Multi-peptide blend concept. Potential applications depend on the confirmed components and amounts.',
'Custom peptide blend concept. Request its exact formula and finished-product documentation.',
'GHRH-related and ghrelin-receptor signaling. Confirm CJC identity and DAC status.',
'GHRH analogue studied for stimulation of growth-hormone release.',
'GHRH analogue; prescription use includes a specific HIV-associated lipodystrophy indication.',
'Mitochondrial-derived peptide studied in metabolic adaptation and physical capacity, chiefly in preclinical models.',
'Investigated in experimental sleep and neural-signaling studies.',
'Modified growth-hormone fragment investigated in preclinical lipid-metabolism studies.',
'Coenzyme central to cellular redox chemistry and energy-related enzyme activity.',
'Copper tripeptide studied in collagen, skin quality and extracellular-matrix biology, including topical studies.',
'Preclinical tendon and ligament studies examine repair, cell migration and tissue response.',
'Thymosin-beta-4-related pathways: cell movement and tissue remodeling. Exact molecular identity matters.',
'Cell and mouse studies examine intestinal inflammatory signaling and epithelial transport.',
'ACTH-related peptide investigated in experimental neurotrophin and nervous-system signaling.',
'Tuftsin-related peptide investigated in neural and anxiety-related experimental pathways.',
'Tetrapeptide investigated in gene regulation and telomere biology in experimental models.',
'Mitochondrial cardiolipin targeting; a distinct prescription product has a specific Barth syndrome indication.',
'Ghrelin-receptor agonist studied for growth-hormone release and endocrine signaling.',
'Thymalfasin; investigated in immune-cell signaling and specific clinical contexts.',
'Bremelanotide; melanocortin signaling. A distinct prescription formulation has a specific female HSDD indication.'
]
for i,(p,s) in enumerate(zip(items,shorts)):
 col=i//12;row=i%12;x=35+col*270;y=640-row*40
 c.setStrokeColor(HexColor('#D9CBB8'));c.setLineWidth(.4);c.line(x,y+11,x+255,y+11)
 text(x,y,p['name'],9,'DVB');para(x,y-6,s,250,7.2)
c.setStrokeColor(HexColor('#B79A68'));c.line(35,161,560,161)
text(35,145,'DOCUMENTATION & DESTINATION REVIEW',8,'DVB','#91703E')
para(35,134,'Request lot-matched identity, purity and content reports. Blend formulas, stock, shipping terms and destination requirements are confirmed in writing. Additional testing or certification claims require supporting records.',525,7.3)
text(35,94,'TAILOR MADE / Signature Edit • Boutique 35 • Private Collection',8,'DVB','#91703E')
text(35,79,'Boutique 35: $4,200 less 10% ($420) = $3,780 USD. Freight, duties and taxes quoted separately.',7.1)
text(35,59,'Info@covapep.com   |   Instagram @cova.pep   |   TikTok: request the official profile by email',7.2)
c.linkURL('mailto:Info@covapep.com',(35,56,150,69));c.linkURL('https://www.instagram.com/cova.pep/',(160,56,310,69))
para(35,44,'Evidence context varies: experimental findings and prescription-product results do not establish individual outcomes for another formulation. Inventory packages do not prescribe dosing. Request supporting references and documentation by email.',525,6.5)
c.save();print(out)
