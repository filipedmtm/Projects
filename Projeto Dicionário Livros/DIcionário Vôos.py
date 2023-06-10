#CAIO C G DOS SANTOS RA: 23015616 // FILIPE DANIEL MEDEIROS T. MOTA RA: 23002322.

#ADICIONAR: 
# -- Dada a cidade origem e destino, determinar o voo com menor número de escalar e imprimir todas as informações sobre esse voos.

try:
    dic_voos={}
    qtd=int(input('Quantos vôos deseja registrar? '))

    for i in range (qtd):
        info=[]
        cod=int(input('\nDigite o código do vôo: '))
        origem=input('Digite a cidade de origem: ')
        info.append(origem)
        destino=input('Digite a cidade de destino: ')
        info.append(destino)
        qtd_escalas=int(input('Digite a quantidade de escalas: '))
        info.append(qtd_escalas)
        
        if qtd_escalas>0:
            lista_escalas=[]
            for c in range (qtd_escalas):
                escala=input('Digite a cidade de escala: ')
                lista_escalas.append(escala)
            info.append(lista_escalas)
        dic_voos[cod]=info

    print("\n---------------------------------------------------\n")
    
    for voo in dic_voos:
            print(f'Voo registrado:{voo} - {dic_voos[voo]}')
    
    print("\n---------------------------------------------------\n")
    while True:
        ask1 = input("Deseja Realizar alterações?(S/N) ")
        if ask1.upper() == 'S':
            opcoes = int(input("Dejar alterar (1) ou apagar (2) algum voo? "))
            if opcoes == 1: 
                ask2 = int(input("Digite o código do voo que deseja ser alterado:"))
                new_info=[]
                origem=input('Digite a cidade de origem: ')
                new_info.append(origem)
                destino=input('Digite a cidade de destino: ')
                new_info.append(destino)
                qtd_escalas=int(input('Digite a quantidade de escalas: '))
                new_info.append(qtd_escalas)
            elif opcoes < 1 or opcoes > 2:
                print("Erro!! Digite 1 ou 2.")
            else:
                break
        
        elif ask1.upper() == 'N':
            print("\nInserções finalizadas!")
            print("---------------------------------------------------\n")
            break
        
        else:
            print("Digite 'S' ou 'N'.")

        
        if qtd_escalas>0:
            lista_escalas=[]
            for c in range (qtd_escalas):
                escala=input('Digite a cidade de escala: ')
                lista_escalas.append(escala)
            new_info.append(lista_escalas)
        dic_voos[ask2]=new_info

        print("<<<<Voo alterado com sucesso!>>>>\n")
        print("\n---------------------------------------------------\n")
        for voo in dic_voos:
            print(f'Voo registrado:{voo} - {dic_voos[voo]}')

    aks2 = input("Deseja pagar um voo? (S/N) ")
    if aks2.upper() == 'S':
        ask3 = int(input("Digite o código do voo que deseja ser apagado: "))
        del dic_voos[ask3]
       
        print("\n<<<<Voo apagado com sucesso!>>>>\n")
        print("---------------------------------------------------\n")
    
    else:
        print("\nNão foi apagado nenhum voo.")

except ValueError:
    print('Erro! Na etapa executada.\nTente novamente.\n')
    
finally:
    print("---------------------------------------------------")
    input('\nAperte ENTER para continuar...')
    print("\n---------------------------------------------------")
    #Consulta de quantos voos saem de "tal" cidade.
    consulta = input("\nDeseja consultar quantos voo saem de (x) cidade?(S/N) ")
    count = 0
    if consulta.upper() == 'S':
        cidade = input ("Digite a cidade: ")
        count += 1
        print(f"A quantidade de voos que saem de {cidade} é: {count}")
    else: 
        print("\n---------------------------------------------------")
        input("\nAperte ENTER para continuar...")

    
    input("\nAperte ENTER para sair...")

    print("\n---------------------------------------------------\n")

    #Consutal de menro número de escalas entre uma cidade de origem e destino.
    consulta2 = input("\nDeseja consulta qual voo com menor número de escalas entre uma cidade de origem e destino?(S/N) ")
    if consulta2.upper() == 'S':
        saida = input("Digite a cidade de origem: ")
        chegada = input("Digite a cidade de destino: ")
        for i in dic_voos:
            if dic_voos[i][0] == saida and dic_voos[i][1] == chegada:
                print(f"O voo com menor número de escalas entre {saida} e {chegada} é: {min(i[2] for i in dic_voos.values())} escala(s).")
                break
    else:
        print("\n---------------------------------------------------\n")
        print("Até a proxima...")