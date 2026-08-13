from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.graphics.shapes import Drawing, Line, String, Circle
from pathlib import Path

OUT = Path('output/pdf')
OUT.mkdir(parents=True, exist_ok=True)
FILE = OUT / 'Economics_Q1-31_Memory_Notes.pdf'

answers = [
('1. Meaning of Economics', 'Economics is the social science that studies how people, firms and governments use <b>scarce resources</b> to satisfy <b>unlimited wants</b>. Since resources have alternative uses, people must make choices.', 'Scarcity -> Choice -> Allocation', 'Economics = <b>choice under scarcity</b>.'),
('2. Definitions of Economics', '<b>Adam Smith:</b> study of wealth of nations. <b>Marshall:</b> study of mankind in ordinary business life and material welfare. <b>Robbins:</b> human behaviour between unlimited ends and scarce means with alternative uses. <b>Samuelson:</b> how society uses scarce resources to produce and distribute goods over time, including growth. <br/><br/><b>Comparison:</b> Wealth -> Welfare -> Scarcity/Choice -> Growth and Distribution.', 'S M R S = <b>Wealth, Welfare, Scarcity, Society grows</b>.', 'Write the four names in order: <b>Smith, Marshall, Robbins, Samuelson</b>.'),
('3. Importance of studying Economics', 'Economics helps: (1) individuals spend, save and invest wisely; (2) firms decide what and how much to produce; (3) government make policy on tax, jobs and inflation; (4) society understand poverty, unemployment and inequality; and (5) countries understand trade and growth.', '<b>I-F-G-S-T</b>: Individual, Firm, Government, Society, Trade.', 'It teaches the <b>wise use of limited resources</b> at every level.'),
('4. Scientific methods in microeconomics', '<b>Deductive method:</b> starts with a general principle or assumption and reaches a specific conclusion. Example: price falls, so quantity demanded rises. <br/><br/><b>Inductive method:</b> starts with observations/data and develops a general law. <br/><br/>Modern economics uses both, with models, statistics and <i>ceteris paribus</i> (other things constant).', '<b>D = Down:</b> general rule down to case. <b>I = Increase:</b> cases build up to rule.', 'Deduction: general to particular. Induction: particular to general.'),
('5. Importance of economic models', 'An economic model is a <b>simplified representation of reality</b> based on assumptions. It simplifies complex problems, shows relationships, predicts results, tests policies before use, and guides business decisions. <br/><br/><b>Example:</b> demand-supply model predicts that a fall in rice supply raises its price.', '<b>S-P-T-G</b>: Simplify, Predict, Test, Guide.', 'A model is not real life; it is a <b>useful simplified map</b> of real life.'),
('6. Taxes and subsidies: consumer and producer surplus', '<b>Tax:</b> consumers pay a higher price; producers receive a lower net price. Both consumer and producer surplus fall. Government receives tax revenue, but some trades disappear, causing <b>deadweight loss</b>. <br/><br/><b>Subsidy:</b> consumers pay less and producers receive more; both surpluses rise. But government pays the subsidy and overproduction/overconsumption can create deadweight loss.', '<b>Tax = Take surplus. Subsidy = Support surplus.</b>', 'Tax creates a wedge: buyer pays more, seller gets less.'),
('7. Interest rates and inter-temporal consumption', 'Inter-temporal consumption means choosing consumption <b>now</b> versus <b>later</b>. A higher interest rate rewards saving, so it usually encourages saving and future consumption. It also makes borrowing costly, so borrowers reduce present consumption. A lower rate makes saving less attractive and borrowing cheaper, so present consumption tends to rise.', '<b>High rate: Save. Low rate: Spend.</b>', 'Interest is the <b>price of shifting consumption through time</b>.'),
('8. Role of interest rate in inter-temporal choice', 'A consumer chooses present consumption (C1) and future consumption (C2). The budget-line slope is <b>-(1+r)</b>. Interest rate determines the relative price of present and future consumption. When r rises, the line becomes steeper and saving is more rewarding. At optimum: <b>MRS = 1 + r</b>.', '<b>r rises -> slope rises -> saving rewards rise.</b>', 'Key condition: <b>MRS = 1 + r</b>.'),
('9. Short-run equilibrium: perfect competition', 'A competitive firm is a <b>price taker</b>, so <b>AR = MR = P</b>. It maximizes profit where <b>MC = MR</b> and MC cuts MR from below. <br/><br/>If P > AC: supernormal profit. If P = AC: normal profit. If AVC < P < AC: loss but continue in short run. If P < AVC: shut down.', '<b>MC = MR; P vs AC tells profit; P vs AVC tells shutdown.</b>', 'Draw horizontal <b>AR=MR=P</b>; MC cuts it from below.'),
('10. Monopoly: short-run and long-run equilibrium', 'A monopolist is a single seller. Its demand/AR curve slopes downward and <b>MR lies below AR</b>. It produces where <b>MC = MR</b>, then takes price from the AR curve. <br/><br/>In the short run it may earn profit, normal profit or loss. In the long run, entry barriers prevent competitors, so supernormal profit can continue.', '<b>Monopoly: MR below AR; barriers protect profit.</b>', 'Unlike perfect competition, monopoly may keep <b>abnormal profit in the long run</b>.'),
('11. Income and price changes on budget line', 'Budget equation: <b>M = PxX + PyY</b>. <br/><br/><b>Income changes:</b> income rises -> parallel outward shift; income falls -> parallel inward shift. Slope stays unchanged. <br/><br/><b>Price of X changes:</b> Px falls -> X-intercept moves out and line becomes flatter; Px rises -> X-intercept moves in and line becomes steeper. A proportional change in both prices acts like an opposite income change.', '<b>Income = Shift; one price = Rotate.</b>', 'Remember: <b>income shifts, price pivots</b>.'),
('12. Expected utility under uncertainty', 'Expected utility is the probability-weighted average of utility: <b>EU = p1U(X1) + p2U(X2) + ...</b>. A rational person chooses the option with the highest expected utility, not necessarily the highest expected money value. Risk-averse people often prefer a certain amount because marginal utility of wealth diminishes.', '<b>P-U:</b> Probability x Utility, then add.', 'Expected utility uses <b>utility</b>, not only money.'),
('13. Microeconomics vs Macroeconomics', '<b>Microeconomics:</b> individual units - consumer, firm, industry; demand, supply, price and cost. It is price theory. <br/><br/><b>Macroeconomics:</b> whole economy - national income, employment, inflation and growth. It is income theory.', '<b>Micro = microscope = small units. Macro = map = whole economy.</b>', 'Micro studies <b>parts</b>; macro studies the <b>whole</b>.'),
('14. Economic goods vs free goods', '<b>Economic goods</b> are scarce relative to wants, have price/cost and opportunity cost. Examples: food, cars. <br/><br/><b>Free goods</b> are abundant relative to wants, have no price and no opportunity cost. Examples: sunlight and air in normal conditions. <br/><br/>The key difference is <b>scarcity</b>.', '<b>Economic = scarce = sacrifice. Free = abundant.</b>', 'If it is scarce, it is an <b>economic good</b>.'),
('15. Central problems of an economy', 'Because resources are scarce, every economy decides: <br/><b>1. What</b> to produce and how much? <br/><b>2. How</b> to produce? (labour-intensive or capital-intensive) <br/><b>3. For whom</b> to produce? (distribution) <br/><br/>Modern economics also asks how to achieve growth.', '<b>W-H-F-G:</b> What, How, For whom, Growth.', 'Scarcity creates the three questions: <b>What, How, For whom?</b>'),
('16. Needs, wants and demand', '<b>Need:</b> basic necessity for survival, e.g., food. <b>Want:</b> a specific desire, e.g., pizza. <b>Demand:</b> a want backed by <b>ability and willingness to pay</b> at a given price. <br/><br/>Thus: Need -> Want -> Demand. Not every want becomes demand.', '<b>Demand = Want + Money + Willingness.</b>', 'A desire without purchasing power is a <b>want, not demand</b>.'),
('17. Total utility and marginal utility', '<b>TU</b> is total satisfaction from all units. <b>MU</b> is extra satisfaction from one more unit: <b>MU = Delta TU / Delta Q</b>. <br/><br/>MU positive -> TU rises. MU = 0 -> TU is maximum. MU negative -> TU falls. MU is the slope of the TU curve.', '<b>Positive MU: TU up. Zero MU: TU top. Negative MU: TU down.</b>', 'The turning point: <b>MU = 0, TU maximum</b>.'),
('18. Opportunity cost', 'Opportunity cost is the <b>value of the next best alternative forgone</b> when a choice is made. It is the real economic cost, not just money paid. <br/><br/><b>Example:</b> If 3 hours of study replace a job earning $30, the opportunity cost of studying is $30.', '<b>Choice costs the next best chance.</b>', 'Opportunity cost = <b>next best alternative sacrificed</b>.'),
('19. Demand', 'Demand is the quantity of a good a consumer is <b>willing and able</b> to buy at a <b>given price</b> during a <b>given period</b>, other things constant. It is not merely a desire.', '<b>W-A-P-T:</b> Willing, Able, Price, Time.', 'Demand always needs <b>willingness, ability, price and time</b>.'),
('20. Law of Demand', '<b>Other things remaining constant</b>, price and quantity demanded have an inverse relationship: price rises -> quantity demanded falls; price falls -> quantity demanded rises. Therefore the demand curve slopes downward. Reasons: <b>substitution effect</b> and <b>income effect</b>.', '<b>Price up, demand down; Price down, demand up.</b>', 'Use the phrase <b>ceteris paribus</b> for full marks.'),
('21. Exceptions to Law of Demand', 'Main exceptions are: <br/><b>Giffen goods</b> - poor households buy more of a staple when its price rises. <br/><b>Veblen/prestige goods</b> - high price adds status. <br/><b>Speculation</b> - buyers expect further price rises. <br/><b>Necessities</b> - life-saving goods have little response. <br/><b>Ignorance/emergency</b> - unusual buying behaviour.', '<b>GVSNI:</b> Giffen, Veblen, Speculation, Necessity, Ignorance.', 'Five exceptions: <b>GVSNI</b>.'),
('22. Production', 'Production is the process of combining inputs - land, labour, capital and entrepreneurship - to create goods and services that satisfy wants. It includes creating <b>form, place, time and possession utility</b>; transport is production because it adds place utility.', '<b>LLCE makes utility:</b> Land, Labour, Capital, Entrepreneur.', 'Production means <b>creating utility</b>, not only making factory goods.'),
('23. Factors of production', '<b>Land:</b> natural resources; reward = <b>rent</b>. <br/><b>Labour:</b> human physical and mental effort; reward = <b>wages</b>. <br/><b>Capital:</b> man-made tools/machines/buildings; reward = <b>interest</b>. <br/><b>Entrepreneur:</b> organizes factors and bears risk; reward = <b>profit</b>.', '<b>LLCE -> RWIP:</b> Land-Rent, Labour-Wages, Capital-Interest, Entrepreneur-Profit.', 'Memorize the pair chain: <b>Land-Rent, Labour-Wages, Capital-Interest, Entrepreneur-Profit</b>.'),
('24. Law of Diminishing Marginal Returns', 'When more units of a <b>variable factor</b> are added to a <b>fixed factor</b>, with technology constant, the extra output from each additional unit eventually falls. <br/><br/><b>Example:</b> Adding more workers to one acre of land eventually causes crowding, so each new worker adds less output.', '<b>More workers + same land = less extra output.</b>', 'Use the words <b>variable factor, fixed factor, eventually falls</b>.'),
('25. Marginal Rate of Technical Substitution (MRTS)', 'MRTS is the rate at which one input can replace another while output stays constant on the same isoquant. <b>MRTS(L for K) = -Delta K/Delta L = MPL/MPK.</b> Usually MRTS diminishes as more labour replaces capital; therefore isoquants are convex to the origin.', '<b>Same output, swap inputs.</b>', 'MRTS = <b>labour for capital without changing output</b>.'),
('26. Cobb-Douglas production function', '<b>Q = A L^a K^b</b>, where Q = output, A = technology, L = labour, K = capital, and a/b are output elasticities. <br/><br/>Returns to scale: <b>a+b=1</b> constant; <b>a+b>1</b> increasing; <b>a+b<1</b> decreasing. It also shows diminishing marginal product of each input when the other is fixed.', '<b>ALK:</b> A = technology, L = labour, K = capital. <b>Sum a+b tells scale.</b>', 'For returns to scale, only check <b>a + b</b>.'),
('27. Production Possibility Curve (PPC)', 'A PPC shows the maximum combinations of two goods an economy can produce by using all resources and technology efficiently. <br/><br/>Points <b>on</b> the curve are efficient; <b>inside</b> are inefficient/unemployed resources; <b>outside</b> are unattainable now. Its slope shows opportunity cost. It is normally bowed outward because opportunity cost increases.', '<b>O-I-O:</b> On = efficient, Inside = inefficient, Outside = impossible.', 'PPC teaches <b>scarcity, choice and opportunity cost</b>.'),
('28. Derivation of individual demand curve', '<b>Marginal utility approach:</b> consumer buys until price equals marginal utility (in money). Since MU falls as quantity rises, a lower price leads to more purchase, giving a downward demand curve. <br/><br/><b>Indifference-curve approach:</b> change Px while income and Py stay constant; each new budget-line tangency gives an optimum quantity. Plot price against those quantities to obtain demand.', '<b>MU falls -> Price must fall -> Quantity rises.</b>', 'Demand curve comes from <b>different optimal quantities at different prices</b>.'),
('29. Market equilibrium', 'Market equilibrium occurs where <b>quantity demanded = quantity supplied</b>. This gives equilibrium price and quantity. It is the intersection of demand and supply curves. Above equilibrium price there is surplus, which pushes price down. Below equilibrium price there is shortage, which pushes price up.', '<b>High price = surplus = down. Low price = shortage = up.</b>', 'Equilibrium means <b>Qd = Qs</b>.'),
('30. Equilibrium price and output through demand and supply', 'Equilibrium is determined at the intersection of market demand and supply. <br/><br/>At price above equilibrium: <b>Qs > Qd</b>, surplus arises, sellers cut price. <br/>At price below equilibrium: <b>Qd > Qs</b>, shortage arises, buyers bid price up. <br/><br/>Adjustment continues until <b>Qd = Qs</b>, giving <b>P*</b> and <b>Q*</b>.', '<b>Above: Supply wins. Below: Demand wins.</b>', 'Write both adjustment paths and finish with <b>Qd = Qs</b>.'),
('31. Demand curve from the data', '<b>Data:</b> Price (Tk) = 15, 25, 30, 35, 40; Quantity demanded = 90, 85, 70, 65, 50. <br/><br/>Put <b>Quantity</b> on X-axis and <b>Price</b> on Y-axis. Plot points: (Q,P) = (90,15), (85,25), (70,30), (65,35), (50,40). Join them with a smooth downward-sloping line from upper left to lower right. <br/><br/>Conclusion: as price rises from 15 to 40, quantity demanded falls from 90 to 50; therefore it follows the Law of Demand.', '<b>Q on X, P on Y. Price up -> quantity down.</b>', 'For the graph: <b>X = quantity; Y = price; downward slope</b>.')
]

styles=getSampleStyleSheet()
title=ParagraphStyle('title', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=23, leading=28, alignment=TA_CENTER, textColor=colors.HexColor('#12355B'), spaceAfter=8)
sub=ParagraphStyle('sub', parent=styles['Normal'], fontName='Helvetica', fontSize=10.5, leading=14, alignment=TA_CENTER, textColor=colors.HexColor('#486581'))
h=ParagraphStyle('h', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=14, leading=17, textColor=colors.white, backColor=colors.HexColor('#12355B'), borderPadding=7, spaceBefore=10, spaceAfter=8)
body=ParagraphStyle('body', parent=styles['BodyText'], fontName='Helvetica', fontSize=9.4, leading=13, textColor=colors.HexColor('#172B4D'), spaceAfter=6)
label=ParagraphStyle('label', parent=body, fontName='Helvetica-Bold', fontSize=9, leading=12)
rev=ParagraphStyle('rev', parent=body, fontName='Helvetica-Bold', fontSize=9.2, leading=13, textColor=colors.HexColor('#7A1F1F'))
small=ParagraphStyle('small', parent=body, fontSize=8.7, leading=12, textColor=colors.HexColor('#334E68'))

def footer(canvas, doc):
    canvas.saveState(); canvas.setStrokeColor(colors.HexColor('#B8C6D1')); canvas.line(1.6*cm,1.25*cm,19.4*cm,1.25*cm)
    canvas.setFont('Helvetica',8); canvas.setFillColor(colors.HexColor('#486581')); canvas.drawString(1.6*cm,.8*cm,'Economics: Q1-31 Memory Notes'); canvas.drawRightString(19.4*cm,.8*cm,f'Page {doc.page}')
    canvas.restoreState()

def demand_graph():
    d=Drawing(430,175)
    x0,y0=42,28; w,h=330,110
    d.add(Line(x0,y0,x0+w,y0,strokeColor=colors.HexColor('#172B4D'),strokeWidth=1.2))
    d.add(Line(x0,y0,x0,y0+h,strokeColor=colors.HexColor('#172B4D'),strokeWidth=1.2))
    d.add(String(178,4,'Quantity demanded',fontName='Helvetica-Bold',fontSize=8,fillColor=colors.HexColor('#172B4D')))
    d.add(String(5,118,'Price (Tk)',fontName='Helvetica-Bold',fontSize=8,fillColor=colors.HexColor('#172B4D')))
    pts=[(90,15),(85,25),(70,30),(65,35),(50,40)]
    def xy(q,p): return (x0+(q-45)/50*w, y0+(p-10)/35*h)
    prev=None
    for q,p in pts:
        x,y=xy(q,p)
        if prev: d.add(Line(prev[0],prev[1],x,y,strokeColor=colors.HexColor('#C53030'),strokeWidth=2))
        d.add(Circle(x,y,2.7,fillColor=colors.HexColor('#C53030'),strokeColor=colors.white))
        d.add(String(x-7,y-14,f'({q},{p})',fontName='Helvetica',fontSize=6.7,fillColor=colors.HexColor('#486581')))
        prev=(x,y)
    for q in [50,70,90]:
        x,_=xy(q,15); d.add(String(x-5,y0-10,str(q),fontName='Helvetica',fontSize=7,fillColor=colors.HexColor('#486581')))
    for p in [15,25,35,40]:
        _,y=xy(50,p); d.add(String(x0-17,y-2,str(p),fontName='Helvetica',fontSize=7,fillColor=colors.HexColor('#486581')))
    d.add(String(278,125,'D',fontName='Helvetica-Bold',fontSize=11,fillColor=colors.HexColor('#C53030')))
    return d

story=[Spacer(1,2.2*cm), Paragraph('ECONOMICS',title), Paragraph('Q1-31 Memory Notes | Exam-ready answers for fast revision',sub), Spacer(1,.55*cm)]
legend=[['RED: MUST MEMORIZE','YELLOW: UNDERSTAND','GREEN: FORMULA','BLUE: EXAMPLE'],['Definitions / key laws','Concept / explanation','Write exactly in exam','Use for easy marks']]
t=Table(legend,colWidths=[4.45*cm]*4)
t.setStyle(TableStyle([('BACKGROUND',(0,0),(0,0),colors.HexColor('#FDE2E2')),('BACKGROUND',(1,0),(1,0),colors.HexColor('#FFF4C2')),('BACKGROUND',(2,0),(2,0),colors.HexColor('#D9F5DF')),('BACKGROUND',(3,0),(3,0),colors.HexColor('#DDEEFF')),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),('FONTNAME',(0,1),(-1,-1),'Helvetica'),('FONTSIZE',(0,0),(-1,-1),8),('LEADING',(0,0),(-1,-1),10),('TEXTCOLOR',(0,0),(-1,0),colors.HexColor('#172B4D')),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#B8C6D1')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('ALIGN',(0,0),(-1,-1),'CENTER'),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
story += [t, Spacer(1,.7*cm), Paragraph('<b>How to use tonight:</b> Read the 30-second line first. Then say the mnemonic aloud. Finally, cover the answer and reproduce the bold keywords.', small), PageBreak()]

for i,(question,answer,memory,revision) in enumerate(answers):
    blocks=[Paragraph(question,h),Paragraph('<b>EXAM-READY ANSWER</b><br/>'+answer,body)]
    if i == 30:
        blocks += [Spacer(1,3), demand_graph(), Spacer(1,2)]
    mem=Table([[Paragraph('<b>MEMORY BOX</b><br/>'+memory,label)]],colWidths=[17.8*cm])
    mem.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#FFF4C2')),('BOX',(0,0),(-1,-1),.55,colors.HexColor('#E5B64B')),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    revision_box=Table([[Paragraph('<b>30-SECOND REVISION:</b> '+revision,rev)]],colWidths=[17.8*cm])
    revision_box.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#FDE2E2')),('BOX',(0,0),(-1,-1),.55,colors.HexColor('#E6A0A0')),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    blocks += [mem, Spacer(1,5), revision_box, Spacer(1,10)]
    story.append(KeepTogether(blocks))
    if i in [5,11,17,23,28]: story.append(PageBreak())

doc=SimpleDocTemplate(str(FILE),pagesize=A4,rightMargin=1.6*cm,leftMargin=1.6*cm,topMargin=1.35*cm,bottomMargin=1.65*cm,title='Economics Q1-31 Memory Notes')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(FILE.resolve())
