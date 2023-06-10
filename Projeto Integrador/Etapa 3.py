#### O QUE ESTÁ FALTANDO:

#TRATAMENTO DE EXCEÇÕES



import oracledb

connection = oracledb.connect(
user="bd2402231114",
password="Fabzm10",
dsn="172.16.12.14/xe")

print('\n\nCONEXÃO COM O BANCO DE DADOS REALIZADA COM SUCESSO')

try: 
    cursor = connection.cursor()

    menu=int(input('\nSeja bem vindo ao Sistema de Controle de Qualidade do Ar!\n\n[1] Inserir\n[2] Alterar\n[3] Apagar\n[4] Classificar\n[5] Sair\n\nQue ação deseja realizar?: '))

    while menu!=5:

        while menu <1 or menu > 5:
            menu=int(input('\nOpção inválida.\n\n[1] Inserir\n[2] Alterar\n[3] Apagar\n[4] Classificar\n[5] Sair\n\nPor favor, escolha novamente: '))

        if menu==1:

            consulta_dados="select * from amostras"
            cursor.execute(consulta_dados)
            coluna=cursor.fetchall()

            print(f'\n--- INSERIR NOVA AMOSTRA ---\n\nAtualmente, a tabela contém {cursor.rowcount} amostra(s).\n\n')

            indice=int(input('Insira o número da amostra: '))
            p1=int(input('Insira o valor de MP10: '))
            p2=int(input('Insira o valor de MP25: '))
            p3=int(input('Insira o valor de O3: '))
            p4=int(input('Insira o valor de CO: '))
            p5=int(input('Insira o valor de N02: '))
            p6=int(input('Insira o valor de S02: '))

            insert=f'insert into amostras values ({p1}, {p2}, {p3}, {p4}, {p5}, {p6}, {indice})'
            cursor.execute(insert)
            connection.commit()

            input(f'\n\nAmostra {indice} inserida com sucesso! Pressione "enter" para voltar ao menu.\n\n')
            menu=int(input('[1] Inserir\n[2] Alterar\n[3] Apagar\n[4] Classificar\n[5] Sair\n\nQue ação deseja realizar?:'))
            

        elif menu==2:

            print(f'\n--- ALTERAR AMOSTRA EXISTENTE ---\n\n')
            consulta_dados="select * from amostras order by indice asc"
            cursor.execute(consulta_dados)
            coluna=cursor.fetchall()

            for linha in coluna:
                print(f'AMOSTRA{linha[6]:3d} | MP10: {linha[0]:4d} | MP25: {linha[1]:4d} | O3: {linha[2]:4d} | CO: {linha[3]:4d} | NO2: {linha[4]:4d} | S02: {linha[5]:4d} |\n')

            indice=int(input('Insira o número da amostra que deseja alterar: '))
            p1=int(input('Insira o novo valor de MP10: '))
            p2=int(input('Insira o novo valor de MP25: '))
            p3=int(input('Insira o novo valor de O3: '))
            p4=int(input('Insira o novo valor de CO: '))
            p5=int(input('Insira o novo valor de N02: '))
            p6=int(input('Insira o novo valor de S02: '))

            update=f'update amostras set mp10={p1}, mp25={p2}, o3={p3}, co={p4}, no2={p5}, so2={p6} where indice={indice}'
            cursor.execute(update)
            connection.commit()

            input(f'\n\nAmostra {indice} alterada com sucesso! Pressione "enter" para voltar ao menu.\n\n')
            menu=int(input('[1] Inserir\n[2] Alterar\n[3] Apagar\n[4] Classificar\n[5] Sair\n\nQue ação deseja realizar?:'))

        elif menu==3:
                
            print(f'\n--- APAGAR AMOSTRA ---\n\n')
            consulta_dados="select * from amostras order by indice asc"
            cursor.execute(consulta_dados)
            coluna=cursor.fetchall()

            for linha in coluna:
                print(f'AMOSTRA{linha[6]:3d} | MP10: {linha[0]:4d} | MP25: {linha[1]:4d} | O3: {linha[2]:4d} | CO: {linha[3]:4d} | NO2: {linha[4]:4d} | S02: {linha[5]:4d} |\n')

            del_linha=int(input('Digite o número da amostra a ser deletada: '))
            ask = input(f'\nDeseja realmente apagar a amostra {del_linha}? S/N: ')           
            if ask == 's' or ask == 'S':
                delete=f'delete from amostras where indice={del_linha}'
                cursor.execute(delete)
                connection.commit()
                    
                input(f'\nAmostra {del_linha} apagada com sucesso! Pressione "enter" para voltar ao menu.\n\n')
                menu=int(input('[1] Inserir\n[2] Alterar\n[3] Apagar\n[4] Classificar\n[5] Sair\n\nQue ação deseja realizar?:'))
            
            else:
                input(f'\nAmostra {del_linha} não foi apagada. Pressione "enter" para voltar ao menu.\n\n')
                menu=int(input('[1] Inserir\n[2] Alterar\n[3] Apagar\n[4] Classificar\n[5] Sair\n\nQue ação deseja realizar?:'))
        
        else: 
            avg="select avg(mp10), avg(mp25), avg(o3), avg(co), avg(no2), avg(so2) from amostras"
            cursor.execute(avg)
            lista_medias=cursor.fetchall() 

            print('\n<<<<<MÉDIA DAS AMOSTRAS>>>>>\n\n')
            for media in lista_medias:
                print (f'MP10: {media[0]:.2f} | MP25: {media[1]:.2f} | O3: {media[2]:.2f} | CO: {media[3]:.2f} | NO2: {media[4]:.2f} | SO2: {media[5]:.2f}\n')
                
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
            input(f'\n\nPressione "enter" para voltar ao menu.\n\n')
            menu=int(input('[1] Inserir\n[2] Alterar\n[3] Apagar\n[4] Classificar\n[5] Sair\n\nQue ação deseja realizar?:'))

except Exception as err:
    print ('Erro na leitura dos dados')

finally:
    cursor.close()
    print ('\n\nPrograma finalizado\n\n')

        






    