#ETAPA 00
#SENHA
tentativa=3

while True:

    senha=int(input(f'\nDigite a senha para abrir o caixa. Você tem direito a mais {tentativa} tentativas: '))

    if senha!=7878:
        tentativa=tentativa-1
        if tentativa==0:
            print ('\n\tSENHA INCORRETA...\n\tSistema deve ser reinicializado.\n')
            break
    else:
        break
            
                           
if senha == 7878:
    #ETAPA 01
    #VALOR DAS CÉDULAS
    ced200=200.00
    ced100=100.00
    ced50=50.00
    ced10=10.00
    ced5=5.00
    mod1=1.00
    mod50=0.50
    #QUANTIDADE DE CÉDULAS
    quant_ced200 = 2
    quant_ced100 = 4
    quant_ced50 = 6
    quant_ced10 = 10
    quant_ced5 = 10
    quant_mod1 = 20
    quant_mod50 = 20
    #CALCULO DO VALOR ABERTURA DO CAIXA
    valor_abertura=(quant_ced200*ced200)+(quant_ced100*ced100)+(quant_ced50*ced50)+(quant_ced10*ced10)+(quant_ced5*ced5)+(quant_mod1*mod1)+(quant_mod50*mod50)

    cont_vendas = 0
    vtotal_vendas = 0
    print(f'Caixa aberto!! Contem: R${valor_abertura}') #abertura do caixa

    while True:
        #ETAPA 02
        print('\n\t<<<<ENTRE COM OS ITENS DA COMPRA>>>>')

        num_item = 0
        soma_compra = 0

        while True: #LISTAGEM DOS ITEM PARA SOMATÓRIA DO VALOR A SER PAGO.
            num_item = num_item+1
            valor_compra = float(input(f'Digite o valor do item {num_item}: '))
            soma_compra = soma_compra+valor_compra

            if valor_compra>-1:
                valor_antigo=valor_compra
                soma_antiga=soma_compra # NOVA VARIÁVEL
    
            
            while valor_compra == -1: # TROCADO IF POR WHILE
                soma_compra=soma_antiga # SOMA ANTIGA É A SOMA ANTES DE SOMAR O VALOR_COMPRA ANTECEDIDO PELO -1
                num_item=num_item-1
                soma_compra=soma_compra-valor_antigo
                valor_compra = float(input(f'Digite o valor corretor do item {num_item}: '))
                soma_compra = soma_compra + valor_compra
                break

            if valor_compra<-1:
                soma_compra=soma_compra-valor_compra
                valor_compra = float(input(f'Valor inválido. Por favor, digite novamente o valor do item {num_item}: '))
                soma_compra = soma_compra+valor_compra

            if valor_compra == 0:
                msg = input('\nDeseja realmente finalizar a compra? (S=Sim/N=Não) ') 

                if msg.upper() == 'S':
                    total_itens = num_item - 1
                    print(f'\n\nVenda finalizada com {total_itens} itens.\nO valor total da compra foi R$ {soma_compra:.2f}.')
                    break
                else:
                    num_item = num_item - 1
    #ETAPA 03
        divida = soma_compra 
        if divida > 0:
            #PAGAMENTO.
            pagamento = float(input('(Forma de pagamento deve ser em dinheiro) Valor pago de: R$'))
            quitacao = pagamento - divida #pagamento da compra.
            cont_vendas = cont_vendas + 1 #Contagem de vendas/clientes atendidos.
            vtotal_vendas = vtotal_vendas + divida   #Valor total das vendas do dia.
            if quitacao == 0: #Quitação da compra sem troco.
                sobra_troco=valor_abertura
                print('\tNÃO HÁ TROCO.')
            elif quitacao < 0: #Quitação caso o pagamento seja inferior ao valor da compra.
                cont_vendas = cont_vendas - 1
                vtotal_vendas = vtotal_vendas - divida 
                print('Erro no Pagamento. Por favor, pressione "N" para reiniciar a venda ou "S" para cancelar e fechar o caixa.')
            else:
                print(f'Troco: R${quitacao:.2f}') #Troco caso o pagamento seja maior que o valor da compra existe troco.
                troco = quitacao
                n_ced = troco // 200
                if n_ced >= 1:
                    if quant_ced200 < n_ced:
                        n_ced = quant_ced200
                    quant_ced200 = quant_ced200 - n_ced
                    troco = troco - (n_ced * 200)
                    print(f"{n_ced:.0f} notas de R${ced200}")
                    
                n_ced = troco // ced100
                if n_ced >= 1:
                    if quant_ced100 < n_ced:
                        n_ced = quant_ced100
                    print(f"{n_ced:.0f} notas de R${ced100}")
                    quant_ced100 = quant_ced100 - n_ced
                    troco = troco - (n_ced * 100)

                n_ced = troco // ced50
                if n_ced >= 1:
                    if quant_ced50 < n_ced:
                        n_ced = quant_ced50
                    print(f"{n_ced:.0f} notas de R${ced50}")
                    quant_ced50 = quant_ced50 - n_ced
                    troco = troco - (n_ced * 50)

                n_ced = troco // ced10
                if n_ced >= 1:
                    if quant_ced10 < n_ced:
                        n_ced = quant_ced10
                    print(f"{n_ced:.0f} notas de R${ced10}")
                    quant_ced10 = quant_ced10 - n_ced
                    troco = troco - (n_ced * 10)

                n_ced = troco // ced5
                if n_ced >= 1:
                    if quant_ced5 < n_ced:
                        n_ced = quant_ced5
                    print(f"{n_ced:.0f} notas de R${ced5}")
                    quant_ced5 = quant_ced5 - n_ced
                    troco = troco - (n_ced * 5)

                n_mod = troco // mod1
                if n_mod >= 1:
                    if quant_mod1 < n_mod:
                        n_mod = quant_mod1
                    print(f"{n_mod:.0f} moedas de R${mod1}")
                    quant_mod1 = quant_mod1 - n_mod
                    troco = troco - (n_mod * 1)

                n_mod = troco / mod50
                if n_mod >= 1:
                    if quant_mod50 < n_mod:
                        n_mod = quant_mod50
                    print(f"{n_mod:.0f} moedas de R${mod50}")
                    quant_mod50 = quant_mod50 - n_mod
                    troco = troco - (n_mod * 0.5)
                    
                if troco > 0:
                    print(f"Não há troco suficiente para o pagamento, ainda faltam R${troco:.2f}")
        
        #FECHAMENTO DO CAIXA.
        msg = input('\nFechar o Caixa (S = Sim e N = Não)')
        if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado. 
            print('\nCaixa Fechado.')
            break

#ETAPA 04 TELA DE FECHAMENTO DE CAIXA.
    valor_fechamento=(quant_ced200*ced200)+(quant_ced100*ced100)+(quant_ced50*ced50)+(quant_ced10*ced10)+(quant_ced5*ced5)+(quant_mod1*mod1)+(quant_mod50*mod50)
    print(f'\n\n                   Fechamento do Caixa!!!')
    print(f'\n\tNúmero de Clientes Atendidos: {cont_vendas}')
    print(f'\n\tValor Total das Vendas: R${vtotal_vendas:.2f}')
    print(f'\n\tValor Existente no Caixa: R${valor_fechamento:.2f}\n')
    print(f'''\n\tCédulas existentes no Caixa:\n\n\t {quant_ced200: .0f} Cédulas de R$200 
    \n\t {quant_ced100: .0f} Cédula(s) de R$100
    \n\t {quant_ced50: .0f} Cédula(s) de R$50
    \n\t {quant_ced10: .0f} Cédula(s) de R$10
    \n\t {quant_ced5: .0f} Cédula(s) de R$5
    \n\t {quant_mod1: .0f} Moeda(s) de R$1
    \n\t {quant_mod50: .0f} Moeda(s) de R$0.5''')
    print('\n\tAté Breve...............')
