#ETAPA 00
#SENHA
tentativa=4

while tentativa!=0:

    tentativa=tentativa-1

    senha=int(input(f'\nDigite a senha para abrir o caixa. Você tem direito a mais {tentativa} tentativas: '))

    if senha!=7878:
        if tentativa==1:
            print ('\n\tSENHA INCORRETA...\n\tSistema deve ser reinicializado.\n')
            break
            
                           
    else:
        print('\nCaixa aberto!\n')
        #ETAPA 01
        #VARIAVEIS CÉDULAS
        ced200=200.00
        ced100=100.00
        ced50=50.00
        ced10=10.00
        ced5=5.00
        mod1=1.00
        mod50=0.50
        valor_abertura=2*ced200+4*ced100+6*ced50+10*ced10+10*ced5+20*mod1+20*mod50

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

                if valor_compra<0:
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
                    print(f'Troco: R${quitacao:.2f}') #Troco caso o pagamento seja maior que o valor da compra. 
                    valor_abertura = valor_abertura - quitacao
                    sobra_troco = valor_abertura
            #FECHAMENTO DO CAIXA.
            msg = input('\nFechar o Caixa (S = Sim e N = Não)')
            if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado. 
                print('\nCaixa Fechado.')
                break

        #ETAPA 04 TELA DE FECHAMENTO DE CAIXA.
        print(f'\n\n                   Fechamento do Caixa!!!')
        print(f'\n\tNúmero de Clientes Atendidos: {cont_vendas}')
        print(f'\n\tValor Total das Vendas: R${vtotal_vendas:.2f}')
        print(f'\n\tValor Existente no Caixa: R${sobra_troco:.2f}')
        print('Até Breve...............')
    break

