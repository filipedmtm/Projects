#DEF REGISTRAR VOOS:
def registrar(dic_voos={}):
    qtd=int(input('\nQuantos vôos deseja registrar? '))
    for i in range(qtd):
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
            for i in range(qtd_escalas):
                escala=input('Digite a cidade de escala: ')
                lista_escalas.append(escala)
            info.append(lista_escalas)
        dic_voos[cod]=info 
    print("\n---------------------------------------------------")
    for voo in dic_voos:
            print(f'Voo registrado:{voo} - {dic_voos[voo]}')    
    print("---------------------------------------------------")
    return dic_voos


#DEF ALTERAR OU APAGAR VOOS:
def alterar(dic_voos):
    while True:
        opcoes = int(input("ALTERAR (1) APAGAR (2): "))
        if opcoes == 1: 
            ask2 = int(input("Digite o código do voo que deseja ser alterado:"))
            new_info=[]
            origem=input('Digite a cidade de origem: ')
            new_info.append(origem)
            destino=input('Digite a cidade de destino: ')
            new_info.append(destino)
            qtd_escalas=int(input('Digite a quantidade de escalas: '))
            new_info.append(qtd_escalas)
            if qtd_escalas>0:
                lista_escalas=[]
                for c in range (qtd_escalas):
                    escala=input('Digite a cidade de escala: ')
                    lista_escalas.append(escala)
                new_info.append(lista_escalas)
            dic_voos[ask2]=new_info

            print("\n<<<<Voo alterado com sucesso!>>>>\n")
            print("---------------------------------------------------")
            
            for voo in dic_voos:
                print(f'Voo registrado:{voo} - {dic_voos[voo]}')
            break

        elif opcoes < 1 or opcoes > 2:
            print("Erro!! Digite 1 ou 2.")
        else:
            apagar = int(input("Digite o código do voo que deseja ser apagado: "))
            del dic_voos[apagar]
                    
            print("\n<<<<Voo apagado com sucesso!>>>>\n")
            print("---------------------------------------------------")
            break
    return dic_voos

#DEF CONSULTA POR ORIGEM:
def origem(dic_voos):
    count = 0
    cidade = input("Digite a cidade de origem: ")
    for i in dic_voos:
        if cidade in dic_voos[i][0]:
            count += 1
    print(f"\n-----Saem {count} vôos da cidade de {cidade}-----")
    return dic_voos

#DEF CONSULTA POR ESCALA:
def escala(dic_voos):
    saida = input("Digite a cidade de origem: ")
    chegada = input("Digite a cidade de destino: ")
    for i in dic_voos:
        if dic_voos[i][0] == saida and dic_voos[i][1] == chegada:
            print(f"O voo com menor número de escalas entre {saida} e {chegada} é: {min(i[2] for i in dic_voos.values())} escala(s).")
            print(dic_voos[i])
            break
    return dic_voos

#DEF CONSULTA POR DESTINO:
def destino(dic_voos):
    chegada = input("Digite a cidade de destino: ")
    print("---------------------------------------------------")
    for i in dic_voos:
        if chegada in dic_voos[i][1]:
            print(dic_voos[i])
    print("---------------------------------------------------")

#PROGRAMA MAIN:
while True:
    print("\n\n<<<BEM VINDO AO SISTEMA DE VOOS>>>\n")

    print("1 - Registrar vôos.")
    print("2 - Alterar ou apagar vôos.")
    print("3 - Consultar vôos por origem.")
    print("4 - Consultar vôos com menor escala (origem e destino definidos).")
    print("5 - Consultar vôos por destino.")
    print("6 - Sair do sistema.\n")

    while True:
        try:
            opcao = int(input("Digite a opção desejada: "))
            if opcao < 1 or opcao > 6:
                print("<<<Digite um valor positivo: 1 até 6>>>")
            else:
                break
        except ValueError:
            print("<<<Opção inválida! Digite um número inteiro>>>")
        
    if opcao == 1:
        dic_voos = registrar()
    elif opcao == 2:
        dic_voos = alterar(dic_voos)
    elif opcao == 3:
        origem(dic_voos)
    elif opcao == 4:
        escala(dic_voos)
    elif opcao == 5:
        destino(dic_voos)
    else:
        for i in range(3):
            print(f"SAINDO DO SISTEMA EM {3-i} ...")
            import time
            time.sleep(1)
        print("\n<<<SISTEMA FINALIZADO>>>")
        break


