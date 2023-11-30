#MP10
p1 = float(input("Insira uma dado para análise do mp10: "))
while p1 < 0:
    p1 = float(input("Dado invalido! Insira novamente para análise do mp10: "))

#MP2,5
p2 = float(input("Insira uma dado para análise do mp25: "))
while p2 < 0:
    p2 = float(input("Dado invalido! Insira novamente para análise do mp2,5: "))

#03
p3 = float(input("Insira uma dado para análise do O3: "))
while p3 < 0:
    p3 = float(input("Dado invalido! Insira novamente para análise do O3: "))

#CO
p4 = float(input("Insira uma dado para análise do CO: "))
while p4 < 0:
    p4 = float(input("Dado invalido! Insira novamente para análise do CO: "))

#NO2
p5 = float(input("Insira uma dado para análise do NO2: "))
while p5 < 0:
    p5 = float(input("Dado invalido! Insira novamente para análise do NO2: "))

#SO2
p6 = float(input("Insira uma dado para análise do SO2: "))
while p6 < 0:
    p6 = float(input("Dado invalido! Insira novamente para análise do SO2: "))

print("\nAmostra Salva.")

# Condições únicas para qualidade Boa:
if p1<51 and p2<26 and p3<101 and p4<10 and p5<201 and p6<21:
    qualidade_ar = "boa"
    print(f"\nPara esta amostra, a qualidade do ar é {qualidade_ar}. Não existe nenhum efeito à  saúde.\n")

# Qualquer parâmetro moderado altera a qualidade do ar para Moderado:
elif 50<p1<101 or 25<p2<51 or 100<p3<131 or 9<p4<12 or 200<p5<241 or 20<p6<41:
    qualidade_ar = "moderada"
    print(f"\nPara esta amostra, a qualidade do ar é {qualidade_ar}. Pessoas de grupos sensíveis (crianças, idosos e pessoas com doenças resporatórias e cardíacas) podem apresentar sintomas como tosse seca e cansaço. A população, em geral, não é afetada.\n")

# Qualquer parâmetro ruim altera a qualidade do ar para ruim:
elif 100<p1<151 or 50<p2<76 or 130<p3<161 or 11<p4<14 or 240<p5<321 or 40<p6<366:
    qualidade_ar = "ruim"
    print(f"\nPara esta amostra, a qualidade do ar é {qualidade_ar}. Toda a população pode apresentar sintomas como tosse seca, cansaço, ardor nos olhos, nariz e garganta. Pessoas de grupos sensíveis (crianças, idosos, e pessoas com doenças respiratórias e cardíacas) podem apresentar efeitos mais sérios na saúde.\n")

# Qualquer parâmetro muito ruim altera o a qualidade do ar para Muito Ruim:
elif 150<p1<251 or 75<p2<126 or 160<p3<201 or 13<p4<16 or 320<p5<1131 or 365<p6<801:
    qualidade_ar = "muito ruim"
    print(f"\nPara esta amostra, a qualidade do ar é {qualidade_ar}. Toda a população pode apresentar agravamento dos sintomas como tosse seca, cansaço, ardor nos olhos, nariz e garganta e ainda falta de ar e respiração ofegante. Efeitos ainda mais graves à saúde de grupos sensíveis (crianças, idosos e pessoas com doenças respiratórias e cardíacas).\n")

# Qualquer parâmetro péssimo altera o a qualidade do ar para Péssima:
else:
    qualidade_ar = "péssima"
    print(f"\nPara esta amostra, a qualidade do ar é {qualidade_ar}. Toda a população pode apresentar sérios riscos de manifestações de doenças respiratórias e cardiovasculares. Aumento de mortes prematuras em pessoas de grupos sensíveis.\n")



    


