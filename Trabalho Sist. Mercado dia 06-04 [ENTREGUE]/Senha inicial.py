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


