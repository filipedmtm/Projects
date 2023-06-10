import oracledb

connection = oracledb.connect(
    user="bd2402231114",
    password="Fabzm10",
    dsn="172.16.12.14/xe")

print('\n\nCONEXÃO AO BANCO DE DADOS REALIZADA COM SUCESSO')

try: 
    cursor = connection.cursor()
    consulta_dados="select * from amostras"
    cursor.execute(consulta_dados)
    coluna=cursor.fetchall()

    print(f'\nQuantidade de amostras: {cursor.rowcount}\n')

    avg="select avg(mp10), avg(mp25), avg(o3), avg(co), avg(no2), avg(so2) from amostras"
    cursor.execute(avg)
    lista_medias=cursor.fetchall()

    #TABELA DE AMOSTRAS
    print('\n<<<<<TABELA DE AMOSTRAS>>>>>\n\n')
    for linha in coluna:
       print(f'AMOSTRA{linha[6]:3d} | MP10: {linha[0]:4d} | MP25: {linha[1]:4d} | O3: {linha[2]:4d} | CO: {linha[3]:4d} | NO2: {linha[4]:4d} | S02: {linha[5]:4d} |\n')

    #TABELA DE MÉDIAS
    print('\n<<<<<MÉDIA DAS AMOSTRAS>>>>>\n\n')
    for media in lista_medias:
        print (f'MP10: {media[0]:.2f} | MP25: {media[1]:.2f} | O3: {media[2]:.2f} | CO: {media[3]:.2f} | NO2: {media[4]:.2f} | SO2: {media[5]:.2f}\n\n')

except Exception as err:
    print ('Erro na leitura dos dados')

finally:
    cursor.close()

# Condições únicas para qualidade Boa:
if media[0]<51 and media[1]<26 and media[2]<101 and media[3]<10 and media[4]<201 and media[5]<21:
    qualidade_ar = "boa"
    print(f"\nPara a média das amostras, a qualidade do ar é {qualidade_ar}. Não existe nenhum efeito à  saúde.\n")

# Qualquer parâmetro moderado altera a qualidade do ar para Moderado:
elif 50<media[0]<101 or 25<media[1]<51 or 100<media[2]<131 or 9<media[3]<12 or 200<media[4]<241 or 20<media[5]<41:
    qualidade_ar = "moderada"
    print(f"\nPara a média das amostras, a qualidade do ar é {qualidade_ar}. Pessoas de grupos sensíveis (crianças, idosos e pessoas com doenças resporatórias e cardíacas) podem apresentar sintomas como tosse seca e cansaço. A população, em geral, não é afetada.\n")

# Qualquer parâmetro ruim altera a qualidade do ar para ruim:
elif 100<media[0]<151 or 50<media[1]<76 or 130<media[2]<161 or 11<media[3]<14 or 240<media[4]<321 or 40<media[5]<366:
    qualidade_ar = "ruim"
    print(f"\nPara a média das amostras, a qualidade do ar é {qualidade_ar}. Toda a população pode apresentar sintomas como tosse seca, cansaço, ardor nos olhos, nariz e garganta. Pessoas de grupos sensíveis (crianças, idosos, e pessoas com doenças respiratórias e cardíacas) podem apresentar efeitos mais sérios na saúde.\n")

#Qualquer parâmetro muito ruim altera o a qualidade do ar para Muito Ruim:
elif 150<media[0]<251 or 75<media[1]<126 or 160<media[2]<201 or 13<media[3]<16 or 320<media[4]<1131 or 365<media[5]<801:
    qualidade_ar = "muito ruim"
    print(f"\nPara a média das amostras, a qualidade do ar é {qualidade_ar}. Toda a população pode apresentar agravamento dos sintomas como tosse seca, cansaço, ardor nos olhos, nariz e garganta e ainda falta de ar e respiração ofegante. Efeitos ainda mais graves à saúde de grupos sensíveis (crianças, idosos e pessoas com doenças respiratórias e cardíacas).\n")

 #Qualquer parâmetro péssimo altera o a qualidade do ar para Péssima:
else:
    qualidade_ar = "péssima"
    print(f"\nPara a média das amostras, a qualidade do ar é {qualidade_ar}. Toda a população pode apresentar sérios riscos de manifestações de doenças respiratórias e cardiovasculares. Aumento de mortes prematuras em pessoas de grupos sensíveis.\n")

print ('\n\nFim do Programa\n')
