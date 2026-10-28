import json
from pathlib import Path
src=Path('/workspace/scratch/749a6eb4c644/sources/cova-package/COVA_Product_Copy.json')
products=json.loads(src.read_text())
copy={
'Retatrutide':('Metabolic','Weight & glucose pathways','Investigational triple GIP, GLP-1 and glucagon receptor agonist. Human trials evaluate weight management and glucose control.'),
'Tirzepatide':('Metabolic','Appetite & glucose signaling','Dual GIP and GLP-1 receptor activity. Approved prescription formulations have clinical evidence for defined metabolic indications; formulation matters.'),
'Semaglutide':('Metabolic','Appetite & metabolic regulation','GLP-1 receptor activity is associated with appetite and glucose regulation in clinical studies of approved prescription formulations.'),
'Wolverine':('Blends','A focus on connective tissue','A BPC-157 and TB-500 collection concept. Component studies explore tissue-repair pathways; the written formula defines the finished blend.'),
'GLOW':('Blends','An interest in skin & recovery','A multi-peptide collection concept. Request the exact composition and individual amounts to understand its intended focus.'),
'KLOW':('Blends','A considered combination','A custom blend concept. Its potential applications depend on the confirmed ingredients, amounts and finished-blend documentation.'),
'CJC-1295 + Ipamorelin':('Vitality','Growth-hormone signaling','A paired approach to GHRH-related and ghrelin-receptor pathways. Confirm the CJC identity and DAC status in the formulation.'),
'Sermorelin':('Vitality','The growth-hormone axis','A GHRH analogue studied for stimulation of growth-hormone release. Applications depend on the formulation and clinical context.'),
'Tesamorelin':('Metabolic','Body-composition pathways','A GHRH analogue. A prescription formulation has a specific indication for excess abdominal fat in adults with HIV-associated lipodystrophy.'),
'MOTS-c':('Vitality','Metabolic resilience','A mitochondrial-derived peptide. Cell and animal studies examine metabolic adaptation, insulin sensitivity and physical capacity.'),
'DSIP':('Mind & rest','Sleep-related signaling','Delta sleep-inducing peptide has been investigated in experimental sleep and neural-signaling studies.'),
'AOD-9604':('Metabolic','Lipid-metabolism pathways','A modified growth-hormone fragment investigated in preclinical fat-metabolism studies; this describes a study focus.'),
'NAD+':('Vitality','Cellular energy chemistry','An essential coenzyme involved in cellular redox reactions and enzyme activity. Its normal biological role is distinct from evidence for supplementation.'),
'GHK-Cu':('Skin & recovery','Collagen & skin quality','Copper tripeptide literature explores fibroblast activity, collagen and extracellular-matrix biology, including topical skin studies.'),
'BPC-157':('Skin & recovery','Connective-tissue pathways','Rat tendon and ligament studies report repair-related findings. Cell studies examine migration, survival and tissue-response pathways.'),
'TB-500':('Skin & recovery','Cell movement & remodeling','Thymosin-beta-4-related studies explore actin regulation and tissue remodeling. Confirm the sequence: fragments and full-length peptides differ.'),
'KPV':('Skin & recovery','Inflammatory balance','A tripeptide studied in epithelial transport and inflammatory signaling. Cell and mouse-colitis studies report anti-inflammatory effects.'),
'Semax':('Mind & rest','Neurotrophin signaling','An ACTH-related peptide investigated in experimental neurotrophin and nervous-system studies.'),
'Selank':('Mind & rest','Neural signaling & stress','A tuftsin-related peptide studied in neurotransmission and gene-expression models, including experimental anxiety-related pathways.'),
'Epithalon':('Vitality','Cellular aging pathways','Also known as epitalon. A tetrapeptide investigated in gene regulation and telomere biology, largely in experimental models.'),
'SS-31':('Vitality','Mitochondrial function','Elamipretide targets mitochondrial cardiolipin. A specific prescription product has clinical evidence and an approved Barth syndrome indication.'),
'Ipamorelin':('Vitality','Growth-hormone release','A ghrelin-receptor agonist and growth-hormone secretagogue studied in endocrine signaling.'),
'Thymosin Alpha-1':('Vitality','Immune-cell signaling','Also known as thymalfasin. Studies investigate immune-cell communication and responses in specific clinical and experimental contexts.'),
'PT-141':('Vitality','Sexual-response pathways','Bremelanotide acts at melanocortin receptors. A prescription formulation has a specific indication for acquired, generalized HSDD in premenopausal women.')}
for x in products:
 x['category'],x['headline'],x['description']=copy[x['name']]
 x['references']=[s.strip() for s in x['source'].split(' ; ') if s.startswith('https://')]
Path('/workspace/sites/cova-boutique/dist/products.json').write_text(json.dumps(products,ensure_ascii=False))
