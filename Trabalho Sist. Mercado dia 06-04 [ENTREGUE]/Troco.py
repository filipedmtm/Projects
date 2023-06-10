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


#ETAPA 03
print(f'Caixa aberto!! Contem: R${valor_abertura}') #abertura do caixa

#O sistema só aceita pagamento em dinheiro
#Apresentação dos valores em duas casas decimais
#Pagamento apenas em dinheiro

soma_total = 200 #teste de soma total de vendas no caixa

divida = soma_total 
print(f'Valor Total: R${divida:.2f}')

pagamento = float(input('(Forma de pagamento deve ser em dinheiro) Valor pago de: R$'))
quitacao = pagamento - divida #pagamento da compra.

if quitacao == 0: #Quitação da compra sem troco.
    print('\tNÃO HÁ TROCO.')
    msg = input('\nFechar o Caixa (S = Sim e N = Não)')
    if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado. 
        print('\nCaixa Fechado.')
    
    else:
        while msg.upper() == 'N': #Loop para não fechar o caixa caso 'N', sempre retorna para cá
            print(f'Valor Total: R${divida:.2f}')
            pagamento = float(input('(Forma de pagamento deve ser em dinheiro) Valor pago de: R$'))
            quitacao = pagamento - divida
            
            if quitacao == 0: #Quitação da compra sem troco.
                print('\tNÃO HÁ TROCO.')
                msg = input('\nFechar o Caixa (S = Sim e N = Não)')
                if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado (sai do loop). 
                    print('\nCaixa Fechado.')
            
            if pagamento > divida: #Quitação da compra com troco apos ter trocado a quantiade do pagamento.
                quitacao = pagamento - divida
                print(f'Troco: R${quitacao:.2f}')
                msg = input('\nFechar o Caixa (S = Sim e N = Não)') #Fechamento do caixa caso 'S' seja digitado (sai do loop). 
                if msg.upper() == 'S':
                    print('\nCaixa Fechado.')      

elif quitacao < 0: #Quitação caso o pagamento seja inferior ao valor da compra.
    print(f'Falta pagar: R${quitacao:.2f}')
    msg = input('\nFechar o Caixa (S = Sim e N = Não)')
    if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado. 
        print('\nCaixa Fechado.')
    
    else:
        while msg.upper() == 'N': #Loop para não fechar o caixa caso 'N', sempre retorna para cá
            print(f'Valor Total: R${divida:.2f}')
            pagamento = float(input('(Forma de pagamento deve ser em dinheiro) Valor pago de: R$'))
            quitacao = pagamento - divida
            
            if quitacao == 0: #Quitação da compra sem troco.
                print('\tNÃO HÁ TROCO.')
                msg = input('\nFechar o Caixa (S = Sim e N = Não)')
                if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado (sai do loop). 
                    print('\nCaixa Fechado.')
            
            if pagamento > divida: #Quitação da compra com troco apos ter trocado a quantiade do pagamento.
                quitacao = pagamento - divida
                print(f'Troco: R${quitacao:.2f}')
                msg = input('\nFechar o Caixa (S = Sim e N = Não)') #Fechamento do caixa caso 'S' seja digitado (sai do loop). 
                if msg.upper() == 'S':
                    print('\nCaixa Fechado.')

else:
    print(f'Troco: R${quitacao:.2f}') #Troco caso o pagamento seja maior que o valor da compra.
    msg = input('\nFechar o Caixa (S = Sim e N = Não)')
    if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado. 
        print('\nCaixa Fechado.')
    
    else:
        while msg.upper() == 'N': #Loop para não fechar o caixa caso 'N', sempre retorna para cá
            print(f'Valor Total: R${divida:.2f}')
            pagamento = float(input('(Forma de pagamento deve ser em dinheiro) Valor pago de: R$'))
            quitacao = pagamento - divida
            
            if quitacao == 0: #Quitação da compra sem troco.
                print('\tNÃO HÁ TROCO.')
                msg = input('\nFechar o Caixa (S = Sim e N = Não)')
                if msg.upper() == 'S': #Fechamento do caixa caso 'S' seja digitado (sai do loop). 
                    print('\nCaixa Fechado.')
            
            if pagamento > divida: #Quitação da compra com troco apos ter trocado a quantiade do pagamento.
                quitacao = pagamento - divida
                print(f'Troco: R${quitacao:.2f}')
                msg = input('\nFechar o Caixa (S = Sim e N = Não)') #Fechamento do caixa caso 'S' seja digitado (sai do loop). 
                if msg.upper() == 'S':
                    print('\nCaixa Fechado.')
    